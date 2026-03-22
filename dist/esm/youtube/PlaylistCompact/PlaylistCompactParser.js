import { stripToInt, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
var PlaylistCompactParser = /** @class */ (function () {
    function PlaylistCompactParser() {
    }
    PlaylistCompactParser.loadPlaylistCompact = function (target, data) {
        var _a;
        var playlistId = data.playlistId, title = data.title, thumbnail = data.thumbnail, shortBylineText = data.shortBylineText, videoCount = data.videoCount, videoCountShortText = data.videoCountShortText;
        target.id = playlistId;
        target.title = title.simpleText || title.runs[0].text;
        target.videoCount = stripToInt(videoCount || videoCountShortText.simpleText) || 0;
        // Thumbnail
        target.thumbnails = new Thumbnails().load(((_a = data.thumbnails) === null || _a === void 0 ? void 0 : _a[0].thumbnails) || thumbnail.thumbnails);
        // Channel
        if (shortBylineText && shortBylineText.simpleText !== "YouTube") {
            var shortByLine = shortBylineText.runs[0];
            target.channel = new BaseChannel({
                id: shortByLine.navigationEndpoint.browseEndpoint.browseId,
                name: shortByLine.text,
                client: target.client,
            });
        }
        return target;
    };
    PlaylistCompactParser.loadLockupPlaylistCompact = function (target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        var lockupMetadataViewModel = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.lockupMetadataViewModel;
        var channelMetadata = (_f = (_e = (_d = (_c = (_b = lockupMetadataViewModel === null || lockupMetadataViewModel === void 0 ? void 0 : lockupMetadataViewModel.metadata) === null || _b === void 0 ? void 0 : _b.contentMetadataViewModel) === null || _c === void 0 ? void 0 : _c.metadataRows) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.metadataParts) === null || _f === void 0 ? void 0 : _f[0];
        var thumbnailViewModel = (_j = (_h = (_g = data.contentImage) === null || _g === void 0 ? void 0 : _g.collectionThumbnailViewModel) === null || _h === void 0 ? void 0 : _h.primaryThumbnail) === null || _j === void 0 ? void 0 : _j.thumbnailViewModel;
        if ((_k = channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.text) === null || _k === void 0 ? void 0 : _k.commandRuns) {
            // not a mix
            var channel = new BaseChannel({
                client: target.client,
                name: channelMetadata.text.content,
                id: ((_p = (_o = (_m = (_l = channelMetadata.text.commandRuns[0]) === null || _l === void 0 ? void 0 : _l.onTap) === null || _m === void 0 ? void 0 : _m.innertubeCommand) === null || _o === void 0 ? void 0 : _o.browseEndpoint) === null || _p === void 0 ? void 0 : _p.browseId) || "",
            });
            target.channel = channel;
        }
        target.id = data.contentId;
        target.title = ((_q = lockupMetadataViewModel === null || lockupMetadataViewModel === void 0 ? void 0 : lockupMetadataViewModel.title) === null || _q === void 0 ? void 0 : _q.content) || "";
        target.videoCount =
            stripToInt((_w = (_v = (_u = (_t = (_s = (_r = thumbnailViewModel === null || thumbnailViewModel === void 0 ? void 0 : thumbnailViewModel.overlays) === null || _r === void 0 ? void 0 : _r[0]) === null || _s === void 0 ? void 0 : _s.thumbnailOverlayBadgeViewModel) === null || _t === void 0 ? void 0 : _t.thumbnailBadges) === null || _u === void 0 ? void 0 : _u[0]) === null || _v === void 0 ? void 0 : _v.thumbnailBadgeViewModel) === null || _w === void 0 ? void 0 : _w.text) || 0;
        target.thumbnails = ((_x = thumbnailViewModel === null || thumbnailViewModel === void 0 ? void 0 : thumbnailViewModel.image) === null || _x === void 0 ? void 0 : _x.sources) ? new Thumbnails().load(thumbnailViewModel.image.sources)
            : new Thumbnails();
        return target;
    };
    return PlaylistCompactParser;
}());
export { PlaylistCompactParser };
