import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Adjust for deployment

const VideoCall = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const startCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      
      setPeerConnection(pc);

      socket.emit("join_room", roomId);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { room: roomId, candidate: event.candidate });
        }
      };

      socket.on("ice-candidate", (data) => {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      });

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

      if (stream) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { room: roomId, offer });
      }
    };

    startCall();
  }, [roomId]);

  return (
    <div className="flex flex-col items-center">
      <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border m-2" />
      <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border m-2" />
    </div>
  );
};

export default VideoCall;