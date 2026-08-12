"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const PlaylistCompact_1 = require("../PlaylistCompact");
const VideoCompact_1 = require("../VideoCompact");
class ChannelParser {
    static loadChannel(target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        let channelId, title, handle, description, avatar, subscriberCountText, videoCountText, tvBanner, mobileBanner, banner;
        const { c4TabbedHeaderRenderer, pageHeaderRenderer } = data.header || {};
        // Present on every real channel regardless of which header renderer Youtube serves,
        // so it can stand in when the header is a shape this parser doesn't understand.
        const channelMetadata = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.channelMetadataRenderer;
        if (c4TabbedHeaderRenderer) {
            channelId = c4TabbedHeaderRenderer.channelId;
            title = c4TabbedHeaderRenderer.title;
            subscriberCountText = (_b = c4TabbedHeaderRenderer.subscriberCountText) === null || _b === void 0 ? void 0 : _b.simpleText;
            videoCountText = (_e = (_d = (_c = c4TabbedHeaderRenderer === null || c4TabbedHeaderRenderer === void 0 ? void 0 : c4TabbedHeaderRenderer.videosCountText) === null || _c === void 0 ? void 0 : _c.runs) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
            avatar = (_f = c4TabbedHeaderRenderer.avatar) === null || _f === void 0 ? void 0 : _f.thumbnails;
            tvBanner = (_g = c4TabbedHeaderRenderer === null || c4TabbedHeaderRenderer === void 0 ? void 0 : c4TabbedHeaderRenderer.tvBanner) === null || _g === void 0 ? void 0 : _g.thumbnails;
            mobileBanner = (_h = c4TabbedHeaderRenderer === null || c4TabbedHeaderRenderer === void 0 ? void 0 : c4TabbedHeaderRenderer.mobileBanner) === null || _h === void 0 ? void 0 : _h.thumbnails;
            banner = (_j = c4TabbedHeaderRenderer === null || c4TabbedHeaderRenderer === void 0 ? void 0 : c4TabbedHeaderRenderer.banner) === null || _j === void 0 ? void 0 : _j.thumbnails;
        }
        else {
            channelId = ChannelParser.parseChannelId(data);
            title = pageHeaderRenderer === null || pageHeaderRenderer === void 0 ? void 0 : pageHeaderRenderer.pageTitle;
            const { metadata, image: imageModel, banner: bannerModel, description: descriptionModel, } = ((_k = pageHeaderRenderer === null || pageHeaderRenderer === void 0 ? void 0 : pageHeaderRenderer.content) === null || _k === void 0 ? void 0 : _k.pageHeaderViewModel) || {};
            const metadataParts = (((_l = metadata === null || metadata === void 0 ? void 0 : metadata.contentMetadataViewModel) === null || _l === void 0 ? void 0 : _l.metadataRows) || [])
                .map((m) => m.metadataParts || [])
                .flat();
            // Auto-generated channels ("<artist> - Topic", Youtube's own hub pages) ship a
            // metadata row for the video count only — no handle and no subscriber count — so
            // every one of these lookups can legitimately come back empty.
            const handlePart = metadataParts.find((m) => { var _a, _b; return (_b = (_a = m.text) === null || _a === void 0 ? void 0 : _a.styleRuns) === null || _b === void 0 ? void 0 : _b.some((s) => "weightLabel" in s); });
            const subscriberCountPart = metadataParts.find((m) => m.accessibilityLabel);
            const videoCountPart = metadataParts.find((m) => { var _a, _b; return (_b = (_a = m.text) === null || _a === void 0 ? void 0 : _a.styleRuns) === null || _b === void 0 ? void 0 : _b.some((s) => "startIndex" in s); });
            handle = (_m = handlePart === null || handlePart === void 0 ? void 0 : handlePart.text) === null || _m === void 0 ? void 0 : _m.content;
            videoCountText = (_o = videoCountPart === null || videoCountPart === void 0 ? void 0 : videoCountPart.text) === null || _o === void 0 ? void 0 : _o.content;
            subscriberCountText = (_p = subscriberCountPart === null || subscriberCountPart === void 0 ? void 0 : subscriberCountPart.text) === null || _p === void 0 ? void 0 : _p.content;
            avatar = (_t = (_s = (_r = (_q = imageModel === null || imageModel === void 0 ? void 0 : imageModel.decoratedAvatarViewModel) === null || _q === void 0 ? void 0 : _q.avatar) === null || _r === void 0 ? void 0 : _r.avatarViewModel) === null || _s === void 0 ? void 0 : _s.image) === null || _t === void 0 ? void 0 : _t.sources;
            banner = (_v = (_u = bannerModel === null || bannerModel === void 0 ? void 0 : bannerModel.imageBannerViewModel) === null || _u === void 0 ? void 0 : _u.image) === null || _v === void 0 ? void 0 : _v.sources;
            description = (_x = (_w = descriptionModel === null || descriptionModel === void 0 ? void 0 : descriptionModel.descriptionPreviewViewModel) === null || _w === void 0 ? void 0 : _w.description) === null || _x === void 0 ? void 0 : _x.content;
        }
        target.id = channelId || (channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.externalId);
        target.name = title || (channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.title);
        target.handle = handle || ChannelParser.parseHandle(channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.vanityChannelUrl);
        target.description = description || (channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.description);
        target.thumbnails = new common_1.Thumbnails().load(avatar || ((_y = channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.avatar) === null || _y === void 0 ? void 0 : _y.thumbnails) || []);
        target.videoCount = videoCountText;
        target.subscriberCount = subscriberCountText;
        target.banner = new common_1.Thumbnails().load(banner || []);
        target.tvBanner = new common_1.Thumbnails().load(tvBanner || []);
        target.mobileBanner = new common_1.Thumbnails().load(mobileBanner || []);
        target.shelves = ChannelParser.parseShelves(target, data);
        return target;
    }
    /** Youtube's own hub pages ("Gaming", "Movies & TV") serve a tab with no endpoint at all. */
    static parseChannelId(data) {
        var _a, _b, _c, _d, _e;
        const tabs = ((_b = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.twoColumnBrowseResultsRenderer) === null || _b === void 0 ? void 0 : _b.tabs) || [];
        for (const tab of tabs) {
            const browseId = (_e = (_d = (_c = tab === null || tab === void 0 ? void 0 : tab.tabRenderer) === null || _c === void 0 ? void 0 : _c.endpoint) === null || _d === void 0 ? void 0 : _d.browseEndpoint) === null || _e === void 0 ? void 0 : _e.browseId;
            if (browseId)
                return browseId;
        }
        return undefined;
    }
    /** `vanityChannelUrl` is a `/@handle` URL for channels that have one, `/channel/ID` otherwise. */
    static parseHandle(vanityChannelUrl) {
        const handle = vanityChannelUrl === null || vanityChannelUrl === void 0 ? void 0 : vanityChannelUrl.split("/").pop();
        return (handle === null || handle === void 0 ? void 0 : handle.startsWith("@")) ? handle : undefined;
    }
    static parseShelves(target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const shelves = [];
        // YouTube serves channels with several different content shapes (e.g. richGridRenderer
        // for video-tab landings, missing tabs for empty channels, no sectionListRenderer when
        // the home tab redirects). Treat any missing link in the chain as "no shelves" rather
        // than crashing the whole channel load — callers only need the header data.
        const rawShelves = (_g = (_f = (_e = (_d = (_c = (_b = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.twoColumnBrowseResultsRenderer) === null || _b === void 0 ? void 0 : _b.tabs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.tabRenderer) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.sectionListRenderer) === null || _g === void 0 ? void 0 : _g.contents;
        if (!Array.isArray(rawShelves))
            return shelves;
        for (const rawShelf of rawShelves) {
            const shelfRenderer = (_h = rawShelf.itemSectionRenderer) === null || _h === void 0 ? void 0 : _h.contents[0].shelfRenderer;
            if (!shelfRenderer)
                continue;
            const { title, content, subtitle } = shelfRenderer;
            if (!content.horizontalListRenderer)
                continue;
            const items = content.horizontalListRenderer.items
                .map((i) => {
                if (i.gridVideoRenderer)
                    return new VideoCompact_1.VideoCompact({ client: target.client }).load(i.gridVideoRenderer);
                if (i.gridPlaylistRenderer)
                    return new PlaylistCompact_1.PlaylistCompact({ client: target.client }).load(i.gridPlaylistRenderer);
                if (i.gridChannelRenderer)
                    return new BaseChannel_1.BaseChannel({ client: target.client }).load(i.gridChannelRenderer);
                return undefined;
            })
                .filter((i) => i !== undefined);
            const shelf = {
                title: title.simpleText || title.runs[0].text,
                subtitle: subtitle === null || subtitle === void 0 ? void 0 : subtitle.simpleText,
                items,
            };
            shelves.push(shelf);
        }
        return shelves;
    }
}
exports.ChannelParser = ChannelParser;
