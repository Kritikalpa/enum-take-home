import React, { useEffect, useRef, useState } from "react";
import styles from "./AudioStrip.module.scss";
import TableSkeleton from "../Shared/Skeleton/TableSkeleton";
import { CloseOutlined } from "@ant-design/icons";

interface AudioStripProps {
  audioUrls: string[];
  width: number;
  onContentLoad?: (el: HTMLDivElement | null) => void;
  onDelete: (updatedVideoList: string) => void;
}

const AudioStrip: React.FC<AudioStripProps> = ({
  audioUrls,
  width,
  onContentLoad,
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
    if (!visible || audioUrls.length === 0) return;

    let loaded = 0;
    const onAudioLoad = () => {
      loaded++;
      if (loaded === audioUrls.length && onContentLoad) {
        onContentLoad(containerRef.current);
      }
    };

    const audios = containerRef.current?.querySelectorAll("audio");
    audios?.forEach((audio) => {
      audio.addEventListener("loadeddata", onAudioLoad, { once: true });
    });
  }, [visible, audioUrls]);

  const handleDelete = (idToRemove: string) => {
    const updated = audioUrls.filter((id) => id !== idToRemove).join(",");
    onDelete(updated);
  };

  return (
    <div ref={containerRef} className={styles.audioStrip}>
      {visible ? (
        audioUrls.filter(Boolean).map((url, index) => (
          <div
            style={{
              position: "relative",
            }}
            key={`audio-${index}`}
          >
            <audio controls className={styles.audioPlayer}>
              <source src={url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <span
              className={styles.iconDelete}
              onClick={() => handleDelete(url)}
            >
              <CloseOutlined />
            </span>
          </div>
        ))
      ) : (
        <TableSkeleton rows={1} cols={1} colWidths={{ 0: width }} />
      )}
    </div>
  );
};

export default AudioStrip;
