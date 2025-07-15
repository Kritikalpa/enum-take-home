import React, { useEffect, useRef, useState } from "react";
import styles from "./AudioStrip.module.scss";
import TableSkeleton from "../Shared/Skeleton/TableSkeleton";

interface AudioStripProps {
  audioUrls: string[];
  width: number;
  onContentLoad?: (el: HTMLDivElement | null) => void;
}

const AudioStrip: React.FC<AudioStripProps> = ({
  audioUrls,
  width,
  onContentLoad,
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

  return (
    <div ref={containerRef} className={styles.audioStrip}>
      {visible ? (
        audioUrls.map((url, index) => (
          <audio key={index} controls className={styles.audioPlayer}>
            <source src={url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ))
      ) : (
        <TableSkeleton rows={1} cols={1} colWidths={{ 0: width }} />
      )}
    </div>
  );
};

export default AudioStrip;
