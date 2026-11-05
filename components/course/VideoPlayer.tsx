interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
}

const VideoPlayer = ({ videoUrl, title }: VideoPlayerProps) => {
  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-sm">
        Відео для цього уроку ще не завантажено
      </div>
    );
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=0&rel=0`
      : null;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : (
        <video
          src={videoUrl}
          controls
          controlsList="nodownload"
          className="w-full h-full object-contain">
          Ваш браузер не підтримує відтворення відео.
        </video>
      )}
    </div>
  );
};
export default VideoPlayer;
