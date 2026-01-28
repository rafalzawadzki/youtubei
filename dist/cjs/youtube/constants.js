"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANDROID_CLIENT = exports.COMMENT_END_POINT = exports.LIVE_CHAT_END_POINT = exports.I_END_POINT = exports.BASE_URL = exports.INNERTUBE_API_KEY = exports.INNERTUBE_CLIENT_VERSION = exports.INNERTUBE_CLIENT_NAME = void 0;
exports.INNERTUBE_CLIENT_NAME = "WEB";
exports.INNERTUBE_CLIENT_VERSION = "2.20201209.01.00";
exports.INNERTUBE_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
exports.BASE_URL = "www.youtube.com";
exports.I_END_POINT = "/youtubei/v1";
exports.LIVE_CHAT_END_POINT = `${exports.I_END_POINT}/live_chat/get_live_chat`;
exports.COMMENT_END_POINT = "/comment_service_ajax";
// ANDROID client for /player endpoint (WEB client returns UNPLAYABLE for some videos)
exports.ANDROID_CLIENT = {
    clientName: "ANDROID",
    clientVersion: "19.35.36",
    clientNameId: "3",
    userAgent: "com.google.android.youtube/19.35.36(Linux; U; Android 13; en_US; SM-S908E Build/TP1A.220624.014) gzip",
    androidSdkVersion: 33,
};
