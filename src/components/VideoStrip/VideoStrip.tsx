import React, { useEffect, useRef, useState } from "react";
import styles from "./VideoStrip.module.scss";
import TableSkeleton from "../Shared/Skeleton/TableSkeleton";
import { CloseOutlined } from "@ant-design/icons";

interface VideoStripProps {
  videoList: {
    data: string;
    category: string;
    duration?: string;
  };
  onOpen: (id: string) => void;
  onContentLoad?: (el: HTMLDivElement | null) => void;
  width: number;
  onDelete: (updatedVideoList: string) => void;
}

const VideoStrip: React.FC<VideoStripProps> = ({
  videoList,
  onOpen,
  onContentLoad,
  width,
  onDelete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const videoIds = videoList?.data?.split(",").filter(Boolean);
    if (!visible || videoIds?.length === 0) return;

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
  }, [visible, videoList]);

  const handleDelete = (idToRemove: string) => {
    const updated = videoList?.data
      ?.split(",")
      .filter((id) => id !== idToRemove)
      .join(",");
    onDelete(updated);
  };

  return (
    <div ref={containerRef} className={styles.videoStrip}>
      {visible ? (
        videoList?.data
          ?.split(",")
          .filter(Boolean)
          .map((id) => (
            <div
              style={{
                position: "relative",
              }}
              key={`thumbnail-${id}`}
            >
              <img
                src={`https://img.youtube.com/vi/${id}/default.jpg`}
                alt="video thumb"
                className={styles.thumbnail}
                onClick={() => onOpen(id)}
              />
              <span
                className={styles.iconDelete}
                onClick={() => handleDelete(id)}
              >
                <CloseOutlined />
              </span>
              <span className={styles.duration}>{videoList?.duration}</span>
            </div>
          ))
      ) : (
        <TableSkeleton rows={1} cols={1} colWidths={{ 0: width }} />
      )}
    </div>
  );
};

export default VideoStrip;
