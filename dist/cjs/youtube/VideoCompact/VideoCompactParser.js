"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCompactParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
class VideoCompactParser {
    static loadVideoCompact(target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const { videoId, title, headline, lengthText, thumbnail, ownerText, shortBylineText, publishedTimeText, viewCountText, badges, thumbnailOverlays, channelThumbnailSupportedRenderers, detailedMetadataSnippets, } = data;
        target.id = videoId;
        target.title = headline
            ? headline.simpleText
            : title.simpleText || ((_b = (_a = title.runs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) || "";
        target.thumbnails = new common_1.Thumbnails().load(thumbnail.thumbnails);
        target.uploadDate = publishedTimeText === null || publishedTimeText === void 0 ? void 0 : publishedTimeText.simpleText;
        target.description =
            ((_c = detailedMetadataSnippets === null || detailedMetadataSnippets === void 0 ? void 0 : detailedMetadataSnippets[0].snippetText.runs) === null || _c === void 0 ? void 0 : _c.map((r) => r.text).join("")) || "";
        target.duration =
            common_1.getDuration((lengthText === null || lengthText === void 0 ? void 0 : lengthText.simpleText) || ((_d = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _d === void 0 ? void 0 : _d.text.simpleText) ||
                "") || null;
        target.isLive =
            !!((badges === null || badges === void 0 ? void 0 : badges[0].metadataBadgeRenderer.style) === "BADGE_STYLE_TYPE_LIVE_NOW") ||
                ((_e = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _e === void 0 ? void 0 : _e.style) === "LIVE";
        target.isShort =
            ((_f = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _f === void 0 ? void 0 : _f.style) === "SHORTS" || false;
        // Channel
        const browseEndpoint = (_j = (_h = (_g = (ownerText || shortBylineText)) === null || _g === void 0 ? void 0 : _g.runs[0]) === null || _h === void 0 ? void 0 : _h.navigationEndpoint) === null || _j === void 0 ? void 0 : _j.browseEndpoint;
        if (browseEndpoint) {
            const id = browseEndpoint.browseId;
            const thumbnails = channelThumbnailSupportedRenderers === null || channelThumbnailSupportedRenderers === void 0 ? void 0 : channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails;
            target.channel = new BaseChannel_1.BaseChannel({
                id,
                name: (ownerText || shortBylineText).runs[0].text,
                thumbnails: thumbnails ? new common_1.Thumbnails().load(thumbnails) : undefined,
                client: target.client,
            });
        }
        target.viewCount = common_1.stripToInt((viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.simpleText) || (viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.runs[0].text));
        return target;
    }
    static loadLockupVideoCompact(target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
        const lockupMetadataViewModel = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.lockupMetadataViewModel;
        const decoratedAvatarViewModel = (_b = lockupMetadataViewModel === null || lockupMetadataViewModel === void 0 ? void 0 : lockupMetadataViewModel.image) === null || _b === void 0 ? void 0 : _b.decoratedAvatarViewModel;
        const thumbnailOverlay = (_e = (_d = (_c = data.contentImage) === null || _c === void 0 ? void 0 : _c.thumbnailViewModel) === null || _d === void 0 ? void 0 : _d.overlays) === null || _e === void 0 ? void 0 : _e[0];
        const thumbnailBadge = (_k = (((_g = (_f = thumbnailOverlay === null || thumbnailOverlay === void 0 ? void 0 : thumbnailOverlay.thumbnailBottomOverlayViewModel) === null || _f === void 0 ? void 0 : _f.badges) === null || _g === void 0 ? void 0 : _g[0]) || ((_j = (_h = thumbnailOverlay === null || thumbnailOverlay === void 0 ? void 0 : thumbnailOverlay.thumbnailOverlayBadgeViewModel) === null || _h === void 0 ? void 0 : _h.thumbnailBadges) === null || _j === void 0 ? void 0 : _j[0]))) === null || _k === void 0 ? void 0 : _k.thumbnailBadgeViewModel;
        const metadataRows = (_m = (_l = lockupMetadataViewModel === null || lockupMetadataViewModel === void 0 ? void 0 : lockupMetadataViewModel.metadata) === null || _l === void 0 ? void 0 : _l.contentMetadataViewModel) === null || _m === void 0 ? void 0 : _m.metadataRows;
        if (decoratedAvatarViewModel && (metadataRows === null || metadataRows === void 0 ? void 0 : metadataRows[0])) {
            const channel = new BaseChannel_1.BaseChannel({
                client: target.client,
                name: ((_q = (_p = (_o = metadataRows[0].metadataParts) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.text) === null || _q === void 0 ? void 0 : _q.content) || "",
                id: ((_v = (_u = (_t = (_s = (_r = decoratedAvatarViewModel.rendererContext) === null || _r === void 0 ? void 0 : _r.commandContext) === null || _s === void 0 ? void 0 : _s.onTap) === null || _t === void 0 ? void 0 : _t.innertubeCommand) === null || _u === void 0 ? void 0 : _u.browseEndpoint) === null || _v === void 0 ? void 0 : _v.browseId) || "",
                thumbnails: ((_y = (_x = (_w = decoratedAvatarViewModel.avatar) === null || _w === void 0 ? void 0 : _w.avatarViewModel) === null || _x === void 0 ? void 0 : _x.image) === null || _y === void 0 ? void 0 : _y.sources) ? new common_1.Thumbnails().load(decoratedAvatarViewModel.avatar.avatarViewModel.image.sources)
                    : undefined,
            });
            target.channel = channel;
        }
        const isLive = ((_2 = (_1 = (_0 = (_z = thumbnailBadge === null || thumbnailBadge === void 0 ? void 0 : thumbnailBadge.icon) === null || _z === void 0 ? void 0 : _z.sources) === null || _0 === void 0 ? void 0 : _0[0]) === null || _1 === void 0 ? void 0 : _1.clientResource) === null || _2 === void 0 ? void 0 : _2.imageName) === "LIVE";
        target.id = data.contentId;
        target.title = ((_3 = lockupMetadataViewModel === null || lockupMetadataViewModel === void 0 ? void 0 : lockupMetadataViewModel.title) === null || _3 === void 0 ? void 0 : _3.content) || "";
        target.isLive = isLive;
        target.duration = !isLive && (thumbnailBadge === null || thumbnailBadge === void 0 ? void 0 : thumbnailBadge.text) ? common_1.getDuration(thumbnailBadge.text) : null;
        target.thumbnails = ((_6 = (_5 = (_4 = data.contentImage) === null || _4 === void 0 ? void 0 : _4.thumbnailViewModel) === null || _5 === void 0 ? void 0 : _5.image) === null || _6 === void 0 ? void 0 : _6.sources) ? new common_1.Thumbnails().load(data.contentImage.thumbnailViewModel.image.sources)
            : new common_1.Thumbnails();
        target.viewCount = ((_10 = (_9 = (_8 = (_7 = metadataRows === null || metadataRows === void 0 ? void 0 : metadataRows[1]) === null || _7 === void 0 ? void 0 : _7.metadataParts) === null || _8 === void 0 ? void 0 : _8[0]) === null || _9 === void 0 ? void 0 : _9.text) === null || _10 === void 0 ? void 0 : _10.content) ? common_1.stripToInt(metadataRows[1].metadataParts[0].text.content)
            : null;
        target.uploadDate = !isLive && ((_11 = metadataRows === null || metadataRows === void 0 ? void 0 : metadataRows[1]) === null || _11 === void 0 ? void 0 : _11.metadataParts)
            ? (_13 = (_12 = metadataRows[1].metadataParts[metadataRows[1].metadataParts.length - 1]) === null || _12 === void 0 ? void 0 : _12.text) === null || _13 === void 0 ? void 0 : _13.content : undefined;
        return target;
    }
}
exports.VideoCompactParser = VideoCompactParser;
