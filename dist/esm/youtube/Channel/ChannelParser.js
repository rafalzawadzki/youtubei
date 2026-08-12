var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
var ChannelParser = /** @class */ (function () {
    function ChannelParser() {
    }
    ChannelParser.loadChannel = function (target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        var channelId, title, handle, description, avatar, subscriberCountText, videoCountText, tvBanner, mobileBanner, banner;
        var _z = data.header || {}, c4TabbedHeaderRenderer = _z.c4TabbedHeaderRenderer, pageHeaderRenderer = _z.pageHeaderRenderer;
        // Present on every real channel regardless of which header renderer Youtube serves,
        // so it can stand in when the header is a shape this parser doesn't understand.
        var channelMetadata = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.channelMetadataRenderer;
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
            var _0 = ((_k = pageHeaderRenderer === null || pageHeaderRenderer === void 0 ? void 0 : pageHeaderRenderer.content) === null || _k === void 0 ? void 0 : _k.pageHeaderViewModel) || {}, metadata = _0.metadata, imageModel = _0.image, bannerModel = _0.banner, descriptionModel = _0.description;
            var metadataParts = (((_l = metadata === null || metadata === void 0 ? void 0 : metadata.contentMetadataViewModel) === null || _l === void 0 ? void 0 : _l.metadataRows) || [])
                .map(function (m) { return m.metadataParts || []; })
                .flat();
            // Auto-generated channels ("<artist> - Topic", Youtube's own hub pages) ship a
            // metadata row for the video count only — no handle and no subscriber count — so
            // every one of these lookups can legitimately come back empty.
            var handlePart = metadataParts.find(function (m) { var _a, _b; return (_b = (_a = m.text) === null || _a === void 0 ? void 0 : _a.styleRuns) === null || _b === void 0 ? void 0 : _b.some(function (s) { return "weightLabel" in s; }); });
            var subscriberCountPart = metadataParts.find(function (m) { return m.accessibilityLabel; });
            var videoCountPart = metadataParts.find(function (m) { var _a, _b; return (_b = (_a = m.text) === null || _a === void 0 ? void 0 : _a.styleRuns) === null || _b === void 0 ? void 0 : _b.some(function (s) { return "startIndex" in s; }); });
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
        target.thumbnails = new Thumbnails().load(avatar || ((_y = channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.avatar) === null || _y === void 0 ? void 0 : _y.thumbnails) || []);
        target.videoCount = videoCountText;
        target.subscriberCount = subscriberCountText;
        target.banner = new Thumbnails().load(banner || []);
        target.tvBanner = new Thumbnails().load(tvBanner || []);
        target.mobileBanner = new Thumbnails().load(mobileBanner || []);
        target.shelves = ChannelParser.parseShelves(target, data);
        return target;
    };
    /** Youtube's own hub pages ("Gaming", "Movies & TV") serve a tab with no endpoint at all. */
    ChannelParser.parseChannelId = function (data) {
        var e_1, _a;
        var _b, _c, _d, _e, _f;
        var tabs = ((_c = (_b = data.contents) === null || _b === void 0 ? void 0 : _b.twoColumnBrowseResultsRenderer) === null || _c === void 0 ? void 0 : _c.tabs) || [];
        try {
            for (var tabs_1 = __values(tabs), tabs_1_1 = tabs_1.next(); !tabs_1_1.done; tabs_1_1 = tabs_1.next()) {
                var tab = tabs_1_1.value;
                var browseId = (_f = (_e = (_d = tab === null || tab === void 0 ? void 0 : tab.tabRenderer) === null || _d === void 0 ? void 0 : _d.endpoint) === null || _e === void 0 ? void 0 : _e.browseEndpoint) === null || _f === void 0 ? void 0 : _f.browseId;
                if (browseId)
                    return browseId;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (tabs_1_1 && !tabs_1_1.done && (_a = tabs_1.return)) _a.call(tabs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return undefined;
    };
    /** `vanityChannelUrl` is a `/@handle` URL for channels that have one, `/channel/ID` otherwise. */
    ChannelParser.parseHandle = function (vanityChannelUrl) {
        var handle = vanityChannelUrl === null || vanityChannelUrl === void 0 ? void 0 : vanityChannelUrl.split("/").pop();
        return (handle === null || handle === void 0 ? void 0 : handle.startsWith("@")) ? handle : undefined;
    };
    ChannelParser.parseShelves = function (target, data) {
        var e_2, _a;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        var shelves = [];
        // YouTube serves channels with several different content shapes (e.g. richGridRenderer
        // for video-tab landings, missing tabs for empty channels, no sectionListRenderer when
        // the home tab redirects). Treat any missing link in the chain as "no shelves" rather
        // than crashing the whole channel load — callers only need the header data.
        var rawShelves = (_h = (_g = (_f = (_e = (_d = (_c = (_b = data.contents) === null || _b === void 0 ? void 0 : _b.twoColumnBrowseResultsRenderer) === null || _c === void 0 ? void 0 : _c.tabs) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.tabRenderer) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.sectionListRenderer) === null || _h === void 0 ? void 0 : _h.contents;
        if (!Array.isArray(rawShelves))
            return shelves;
        try {
            for (var rawShelves_1 = __values(rawShelves), rawShelves_1_1 = rawShelves_1.next(); !rawShelves_1_1.done; rawShelves_1_1 = rawShelves_1.next()) {
                var rawShelf = rawShelves_1_1.value;
                var shelfRenderer = (_j = rawShelf.itemSectionRenderer) === null || _j === void 0 ? void 0 : _j.contents[0].shelfRenderer;
                if (!shelfRenderer)
                    continue;
                var title = shelfRenderer.title, content = shelfRenderer.content, subtitle = shelfRenderer.subtitle;
                if (!content.horizontalListRenderer)
                    continue;
                var items = content.horizontalListRenderer.items
                    .map(function (i) {
                    if (i.gridVideoRenderer)
                        return new VideoCompact({ client: target.client }).load(i.gridVideoRenderer);
                    if (i.gridPlaylistRenderer)
                        return new PlaylistCompact({ client: target.client }).load(i.gridPlaylistRenderer);
                    if (i.gridChannelRenderer)
                        return new BaseChannel({ client: target.client }).load(i.gridChannelRenderer);
                    return undefined;
                })
                    .filter(function (i) { return i !== undefined; });
                var shelf = {
                    title: title.simpleText || title.runs[0].text,
                    subtitle: subtitle === null || subtitle === void 0 ? void 0 : subtitle.simpleText,
                    items: items,
                };
                shelves.push(shelf);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (rawShelves_1_1 && !rawShelves_1_1.done && (_a = rawShelves_1.return)) _a.call(rawShelves_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return shelves;
    };
    return ChannelParser;
}());
export { ChannelParser };
