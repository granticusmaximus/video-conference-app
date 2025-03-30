import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import VideoControls from "./VideoControls";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const VideoCall = ({ roomId = "call-room" }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [reaction, setReaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const setup = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = mediaStream;
      setStream(mediaStream);

      const pc = new RTCPeerConnection();
      mediaStream.getTracks().forEach(track => {
        const sender = pc.addTrack(track, mediaStream);
        track.__sender = sender;
      });

      socket.emit("join_room", roomId);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { room: roomId, candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      socket.on("offer", async (data) => {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { room: roomId, answer });
      });

      socket.on("answer", async (data) => {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      });

      socket.on("ice-candidate", (data) => {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { room: roomId, offer });

      setPeerConnection(pc);
    };

    setup();
  }, [roomId]);

  const leaveCall = () => {
    peerConnection?.close();
    stream?.getTracks().forEach((track) => track.stop());
    socket.disconnect();
    navigate("/dashboard");
  };

  const triggerReaction = (emoji) => {
    setReaction(emoji);
    setTimeout(() => setReaction(null), 2000);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full rounded border" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded border" />
        {reaction && (
          <div className="absolute text-6xl animate-bounce pointer-events-none top-8 left-1/2 transform -translate-x-1/2">
            {reaction}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={() => triggerReaction("😂")} className="text-2xl">😂</button>
        <button onClick={() => triggerReaction("❤️")} className="text-2xl">❤️</button>
        <button onClick={() => triggerReaction("🔥")} className="text-2xl">🔥</button>
      </div>

      <VideoControls stream={stream} onLeave={leaveCall} />
    </div>
  );
};

export default VideoCall;