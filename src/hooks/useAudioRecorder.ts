/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import RecordRTC, { StereoAudioRecorder, State } from "recordrtc";

export const useAudioRecorder = () => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState<State>();
  const [isRecording, setIsRecording] = useState(false);

  const intervalRef = useRef<any>(null);
  const recorderRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        recorderType: StereoAudioRecorder,
        desiredSampRate: 16000,
        disableLogs: true,
      });

      recorderRef.current.startRecording();
      recorderRef.current.stream = stream;
      setRecordingStatus("recording");
      setIsRecording(true);
    } catch (error) {
      alert("Unable to access system audio. Make sure to check 'Share audio' when selecting a tab or screen.");
      console.error(error);
    }
  };

  const stopRecording = (
    callBack?: (blob?: Blob, blobURL?: string) => void,
  ) => {
    recorderRef.current?.stopRecording((blobURL: string) => {
      if (recorderRef.current?.stream) {
        recorderRef.current.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      setRecordingStatus("stopped");
      setIsRecording(false);
      setRecordingTime(0);
      callBack?.(recorderRef.current?.getBlob(), blobURL);
    });
  };

  const pauseRecording = () => {
    recorderRef.current?.pauseRecording();
    setRecordingStatus("paused");
    setIsRecording(false);
  };

  const resumeRecording = () => {
    recorderRef.current?.resumeRecording();
    setRecordingStatus("recording");
    setIsRecording(true);
  };

  const saveRecording = (fileName?: string) => {
    recorderRef.current?.save(fileName);
  };

  const getBlob = (): Blob => {
    return recorderRef.current?.getBlob();
  };

  const toggleRecord = () => {
    if (isRecording || recordingStatus === "recording") {
      stopRecording((blob, blobURL) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `piano-recording-${Date.now()}.wav`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    if (recordingStatus == "recording") {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }

    if (!recordingStatus || recordingStatus == "stopped") {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [recordingStatus]);

  return {
    recordingStatus,
    recordingTime,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    saveRecording,
    getBlob,
    toggleRecord,
  };
};
