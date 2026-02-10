export interface InstagramMediaData {
    __typename: string;
    id: string;
    shortcode: string;
    dimensions: {
        height: number;
        width: number;
    };
    display_url: string;
    video_url?: string;
    is_video: boolean;
    title?: string;
    edge_media_to_caption?: {
        edges: Array<{
            node: {
                text: string;
            };
        }>;
    };
}

export interface InstagramGraphQLResponse {
    data: {
        xdt_shortcode_media: InstagramMediaData | null;
    };
}

export interface DownloadResponse {
    success: boolean;
    data?: {
        videoUrl: string;
        thumbnailUrl: string;
        title: string;
        dimensions: {
            width: number;
            height: number;
        };
    };
    error?: string;
}
