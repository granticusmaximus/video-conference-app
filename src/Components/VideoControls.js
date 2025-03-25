import { useState } from "react";
import {
  BsMicFill,
  BsMicMuteFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillDisplayFill,
  BsDisplay,
  BsBoxArrowRight,
} from "react-icons/bs";

const VideoControls = ({ stream, onLeave }) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);

  const toggleMic = () => {
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCam = () => {
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCamOn(videoTrack.enabled);
    }
  };

  const toggleScreenShare = async () => {
    if (!sharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = stream.getVideoTracks()[0]?.__sender;
      if (sender) {
        sender.replaceTrack(videoTrack);
        setSharing(true);

        videoTrack.onended = () => {
          sender.replaceTrack(stream.getVideoTracks()[0]);
          setSharing(false);
        };
      }
    }
  };

  return (
    <div className="flex justify-center gap-4 p-4 bg-gray-800 rounded mt-4">
      <button onClick={toggleMic} className="text-white text-xl">
        {micOn ? <BsMicFill /> : <BsMicMuteFill />}
      </button>

      <button onClick={toggleCam} className="text-white text-xl">
        {camOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
      </button>

      <button onClick={toggleScreenShare} className="text-white text-xl">
        {sharing ? <BsDisplay /> : <BsFillDisplayFill />}
      </button>

      <button onClick={onLeave} className="text-red-500 text-xl">
        <BsBoxArrowRight />
      </button>
    </div>
  );
};

export default VideoControls;