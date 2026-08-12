import { YoutubeRawData } from "../../common";
import { Channel, ChannelShelf } from "./Channel";
export declare class ChannelParser {
    static loadChannel(target: Channel, data: YoutubeRawData): Channel;
    /** Youtube's own hub pages ("Gaming", "Movies & TV") serve a tab with no endpoint at all. */
    private static parseChannelId;
    /** `vanityChannelUrl` is a `/@handle` URL for channels that have one, `/channel/ID` otherwise. */
    private static parseHandle;
    static parseShelves(target: Channel, data: YoutubeRawData): ChannelShelf[];
}
