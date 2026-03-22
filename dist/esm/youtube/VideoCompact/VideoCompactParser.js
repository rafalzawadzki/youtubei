import { getDuration, stripToInt, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
var VideoCompactParser = /** @class */ (function () {
    function VideoCompactParser() {
    }
    VideoCompactParser.loadVideoCompact = function (target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var videoId = data.videoId, title = data.title, headline = data.headline, lengthText = data.lengthText, thumbnail = data.thumbnail, ownerText = data.ownerText, shortBylineText = data.shortBylineText, publishedTimeText = data.publishedTimeText, viewCountText = data.viewCountText, badges = data.badges, thumbnailOverlays = data.thumbnailOverlays, channelThumbnailSupportedRenderers = data.channelThumbnailSupportedRenderers, detailedMetadataSnippets = data.detailedMetadataSnippets;
        target.id = videoId;
        target.title = headline
            ? headline.simpleText
            : title.simpleText || ((_b = (_a = title.runs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) || "";
        target.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
        target.uploadDate = publishedTimeText === null || publishedTimeText === void 0 ? void 0 : publishedTimeText.simpleText;
        target.description =
            ((_c = detailedMetadataSnippets === null || detailedMetadataSnippets === void 0 ? void 0 : detailedMetadataSnippets[0].snippetText.runs) === null || _c === void 0 ? void 0 : _c.map(function (r) { return r.text; }).join("")) || "";
        target.duration =
            getDuration((lengthText === null || lengthText === void 0 ? void 0 : lengthText.simpleText) || ((_d = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _d === void 0 ? void 0 : _d.text.simpleText) ||
                "") || null;
        target.isLive =
            !!((badges === null || badges === void 0 ? void 0 : badges[0].metadataBadgeRenderer.style) === "BADGE_STYLE_TYPE_LIVE_NOW") ||
                ((_e = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _e === void 0 ? void 0 : _e.style) === "LIVE";
        target.isShort =
            ((_f = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _f === void 0 ? void 0 : _f.style) === "SHORTS" || false;
        // Channel
        var browseEndpoint = (_j = (_h = (_g = (ownerText || shortBylineText)) === null || _g === void 0 ? void 0 : _g.runs[0]) === null || _h === void 0 ? void 0 : _h.navigationEndpoint) === null || _j === void 0 ? void 0 : _j.browseEndpoint;
        if (browseEndpoint) {
            var id = browseEndpoint.browseId;
            var thumbnails = channelThumbnailSupportedRenderers === null || channelThumbnailSupportedRenderers === void 0 ? void 0 : channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails;
            target.channel = new BaseChannel({
                id: id,
                name: (ownerText || shortBylineText).runs[0].text,
                thumbnails: thumbnails ? new Thumbnails().load(thumbnails) : undefined,
                client: target.client,
            });
        }
        target.viewCount = stripToInt((viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.simpleText) || (viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.runs[0].text));
        return target;
    };
    VideoCompactParser.loadLockupVideoCompact = function (target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
        var lockupMetadataViewModel = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.lockupMetadataViewModel;
        var decoratedAvatarViewModel = (_b = lockupMetadataViewModel === null || lockupMetadataViewModel === void 0 ? void 0 : lockupMetadataViewModel.image) === null || _b === void 0 ? void 0 : _b.decoratedAvatarViewModel;
        var thumbnailBadge = (_j = (_h = (_g = (_f = (_e = (_d = (_c = data.contentImage) === null || _c === void 0 ? void 0 : _c.thumbnailViewModel) === null || _d === void 0 ? void 0 : _d.overlays) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.thumbnailOverlayBadgeViewModel) === null || _g === void 0 ? void 0 : _g.thumbnailBadges) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.thumbnailBadgeViewModel;
        var metadataRows = (_l = (_k = lockupMetadataViewModel === null || lockupMetadataViewModel === void 0 ? void 0 : lockupMetadataViewModel.metadata) === null || _k === void 0 ? void 0 : _k.contentMetadataViewModel) === null || _l === void 0 ? void 0 : _l.metadataRows;
        if (decoratedAvatarViewModel && (metadataRows === null || metadataRows === void 0 ? void 0 : metadataRows[0])) {
            var channel = new BaseChannel({
                client: target.client,
                name: ((_p = (_o = (_m = metadataRows[0].metadataParts) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.text) === null || _p === void 0 ? void 0 : _p.content) || "",
                id: ((_u = (_t = (_s = (_r = (_q = decoratedAvatarViewModel.rendererContext) === null || _q === void 0 ? void 0 : _q.commandContext) === null || _r === void 0 ? void 0 : _r.onTap) === null || _s === void 0 ? void 0 : _s.innertubeCommand) === null || _t === void 0 ? void 0 : _t.browseEndpoint) === null || _u === void 0 ? void 0 : _u.browseId) || "",
                thumbnails: ((_x = (_w = (_v = decoratedAvatarViewModel.avatar) === null || _v === void 0 ? void 0 : _v.avatarViewModel) === null || _w === void 0 ? void 0 : _w.image) === null || _x === void 0 ? void 0 : _x.sources) ? new Thumbnails().load(decoratedAvatarViewModel.avatar.avatarViewModel.image.sources)
                    : undefined,
            });
            target.channel = channel;
        }
        var isLive = ((_1 = (_0 = (_z = (_y = thumbnailBadge === null || thumbnailBadge === void 0 ? void 0 : thumbnailBadge.icon) === null || _y === void 0 ? void 0 : _y.sources) === null || _z === void 0 ? void 0 : _z[0]) === null || _0 === void 0 ? void 0 : _0.clientResource) === null || _1 === void 0 ? void 0 : _1.imageName) === "LIVE";
        target.id = data.contentId;
        target.title = ((_2 = lockupMetadataViewModel === null || lockupMetadataViewModel === void 0 ? void 0 : lockupMetadataViewModel.title) === null || _2 === void 0 ? void 0 : _2.content) || "";
        target.isLive = isLive;
        target.duration = !isLive && (thumbnailBadge === null || thumbnailBadge === void 0 ? void 0 : thumbnailBadge.text) ? getDuration(thumbnailBadge.text) : null;
        target.thumbnails = ((_5 = (_4 = (_3 = data.contentImage) === null || _3 === void 0 ? void 0 : _3.thumbnailViewModel) === null || _4 === void 0 ? void 0 : _4.image) === null || _5 === void 0 ? void 0 : _5.sources) ? new Thumbnails().load(data.contentImage.thumbnailViewModel.image.sources)
            : new Thumbnails();
        target.viewCount = ((_9 = (_8 = (_7 = (_6 = metadataRows === null || metadataRows === void 0 ? void 0 : metadataRows[1]) === null || _6 === void 0 ? void 0 : _6.metadataParts) === null || _7 === void 0 ? void 0 : _7[0]) === null || _8 === void 0 ? void 0 : _8.text) === null || _9 === void 0 ? void 0 : _9.content) ? stripToInt(metadataRows[1].metadataParts[0].text.content)
            : null;
        target.uploadDate = !isLive && ((_10 = metadataRows === null || metadataRows === void 0 ? void 0 : metadataRows[1]) === null || _10 === void 0 ? void 0 : _10.metadataParts)
            ? (_12 = (_11 = metadataRows[1].metadataParts[metadataRows[1].metadataParts.length - 1]) === null || _11 === void 0 ? void 0 : _11.text) === null || _12 === void 0 ? void 0 : _12.content : undefined;
        return target;
    };
    return VideoCompactParser;
}());
export { VideoCompactParser };
