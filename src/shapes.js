import { shape, string, number } from 'prop-types';

export const videoShape = shape({
    id: string,
    title: string,
    summary: string,
    provider: string,
    provider_id: string,
    videoDuration: number,
    videoImageUrl: string,
    shareCount: number,
    published: string,
});
