'use client';

interface YouTubePlayerProps {
    videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
    return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-black">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}
