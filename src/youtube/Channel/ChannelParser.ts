import { Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { Channel, ChannelShelf } from "./Channel";

export class ChannelParser {
	static loadChannel(target: Channel, data: YoutubeRawData): Channel {
		let channelId,
			title,
			handle,
			description,
			avatar,
			subscriberCountText,
			videoCountText,
			tvBanner,
			mobileBanner,
			banner;
		const { c4TabbedHeaderRenderer, pageHeaderRenderer } = data.header || {};

		// Present on every real channel regardless of which header renderer Youtube serves,
		// so it can stand in when the header is a shape this parser doesn't understand.
		const channelMetadata = data.metadata?.channelMetadataRenderer;

		if (c4TabbedHeaderRenderer) {
			channelId = c4TabbedHeaderRenderer.channelId;
			title = c4TabbedHeaderRenderer.title;
			subscriberCountText = c4TabbedHeaderRenderer.subscriberCountText?.simpleText;
			videoCountText = c4TabbedHeaderRenderer?.videosCountText?.runs?.[0]?.text;
			avatar = c4TabbedHeaderRenderer.avatar?.thumbnails;
			tvBanner = c4TabbedHeaderRenderer?.tvBanner?.thumbnails;
			mobileBanner = c4TabbedHeaderRenderer?.mobileBanner?.thumbnails;
			banner = c4TabbedHeaderRenderer?.banner?.thumbnails;
		} else {
			channelId = ChannelParser.parseChannelId(data);
			title = pageHeaderRenderer?.pageTitle;

			const {
				metadata,
				image: imageModel,
				banner: bannerModel,
				description: descriptionModel,
			} = pageHeaderRenderer?.content?.pageHeaderViewModel || {};

			const metadataParts = (metadata?.contentMetadataViewModel?.metadataRows || [])
				.map((m: YoutubeRawData) => m.metadataParts || [])
				.flat();

			// Auto-generated channels ("<artist> - Topic", Youtube's own hub pages) ship a
			// metadata row for the video count only — no handle and no subscriber count — so
			// every one of these lookups can legitimately come back empty.
			const handlePart = metadataParts.find((m: YoutubeRawData) =>
				m.text?.styleRuns?.some((s: YoutubeRawData) => "weightLabel" in s)
			);
			const subscriberCountPart = metadataParts.find(
				(m: YoutubeRawData) => m.accessibilityLabel
			);
			const videoCountPart = metadataParts.find((m: YoutubeRawData) =>
				m.text?.styleRuns?.some((s: YoutubeRawData) => "startIndex" in s)
			);

			handle = handlePart?.text?.content;
			videoCountText = videoCountPart?.text?.content;
			subscriberCountText = subscriberCountPart?.text?.content;
			avatar = imageModel?.decoratedAvatarViewModel?.avatar?.avatarViewModel?.image
				?.sources;
			banner = bannerModel?.imageBannerViewModel?.image?.sources;
			description = descriptionModel?.descriptionPreviewViewModel?.description?.content;
		}

		target.id = channelId || channelMetadata?.externalId;
		target.name = title || channelMetadata?.title;
		target.handle = handle || ChannelParser.parseHandle(channelMetadata?.vanityChannelUrl);
		target.description = description || channelMetadata?.description;
		target.thumbnails = new Thumbnails().load(
			avatar || channelMetadata?.avatar?.thumbnails || []
		);
		target.videoCount = videoCountText;
		target.subscriberCount = subscriberCountText;

		target.banner = new Thumbnails().load(banner || []);
		target.tvBanner = new Thumbnails().load(tvBanner || []);
		target.mobileBanner = new Thumbnails().load(mobileBanner || []);
		target.shelves = ChannelParser.parseShelves(target, data);

		return target;
	}

	/** Youtube's own hub pages ("Gaming", "Movies & TV") serve a tab with no endpoint at all. */
	private static parseChannelId(data: YoutubeRawData): string | undefined {
		const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
		for (const tab of tabs) {
			const browseId = tab?.tabRenderer?.endpoint?.browseEndpoint?.browseId;
			if (browseId) return browseId;
		}
		return undefined;
	}

	/** `vanityChannelUrl` is a `/@handle` URL for channels that have one, `/channel/ID` otherwise. */
	private static parseHandle(vanityChannelUrl?: string): string | undefined {
		const handle = vanityChannelUrl?.split("/").pop();
		return handle?.startsWith("@") ? handle : undefined;
	}

	static parseShelves(target: Channel, data: YoutubeRawData): ChannelShelf[] {
		const shelves: ChannelShelf[] = [];

		// YouTube serves channels with several different content shapes (e.g. richGridRenderer
		// for video-tab landings, missing tabs for empty channels, no sectionListRenderer when
		// the home tab redirects). Treat any missing link in the chain as "no shelves" rather
		// than crashing the whole channel load — callers only need the header data.
		const rawShelves =
			data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content
				?.sectionListRenderer?.contents;

		if (!Array.isArray(rawShelves)) return shelves;

		for (const rawShelf of rawShelves) {
			const shelfRenderer = rawShelf.itemSectionRenderer?.contents[0].shelfRenderer;
			if (!shelfRenderer) continue;

			const { title, content, subtitle } = shelfRenderer;
			if (!content.horizontalListRenderer) continue;

			const items:
				| BaseChannel[]
				| VideoCompact[]
				| PlaylistCompact[] = content.horizontalListRenderer.items
				.map((i: YoutubeRawData) => {
					if (i.gridVideoRenderer)
						return new VideoCompact({ client: target.client }).load(
							i.gridVideoRenderer
						);
					if (i.gridPlaylistRenderer)
						return new PlaylistCompact({ client: target.client }).load(
							i.gridPlaylistRenderer
						);
					if (i.gridChannelRenderer)
						return new BaseChannel({ client: target.client }).load(
							i.gridChannelRenderer
						);
					return undefined;
				})
				.filter((i: YoutubeRawData) => i !== undefined);

			const shelf: ChannelShelf = {
				title: title.simpleText || title.runs[0].text,
				subtitle: subtitle?.simpleText,
				items,
			};

			shelves.push(shelf);
		}

		return shelves;
	}
}
