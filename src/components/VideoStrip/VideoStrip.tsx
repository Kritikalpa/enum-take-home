import React, { useEffect, useRef, useState } from "react";
import styles from "./VideoStrip.module.scss";
import TableSkeleton from "../Shared/Skeleton/TableSkeleton";

interface VideoStripProps {
  videoIds: string[];
  onOpen: (id: string) => void;
  onContentLoad?: (el: HTMLDivElement | null) => void;
  width: number;
}

const VideoStrip: React.FC<VideoStripProps> = ({
  videoIds,
  onOpen,
  onContentLoad,
  width,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.01 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || videoIds.length === 0) return;

    let loaded = 0;
    const onThumbLoad = () => {
      loaded++;
      if (loaded === videoIds.length && onContentLoad) {
        onContentLoad(containerRef.current);
      }
    };

    const images = containerRef.current?.querySelectorAll("img");
    images?.forEach((img) => {
      if ((img as HTMLImageElement).complete) {
        onThumbLoad();
      } else {
        img.addEventListener("load", onThumbLoad, { once: true });
      }
    });
  }, [visible, videoIds]);

  return (
    <div ref={containerRef} className={styles.videoStrip}>
      {visible ? (
        videoIds.map((id) => (
          <img
            key={id}
            src={`https://img.youtube.com/vi/${id}/default.jpg`}
            alt="video thumb"
            className={styles.thumbnail}
            onClick={() => onOpen(id)}
          />
        ))
      ) : (
        <TableSkeleton rows={1} cols={1} colWidths={{ 0: width }} />
      )}
    </div>
  );
};

export default VideoStrip;
