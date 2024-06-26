import React, { Profiler, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Grid, Card } from "@mui/material";
import { getVideoById, getVideos, getComments } from "../../API";
import CommentTube from "../Comment/comment";
import LikeButton from "../../Components/LikeButton";
import FollowButton from "../../Components/Buttons/FollowButton";
import ErrorBoundary from "../../Components/ErrorBoundry";
import { createPortal } from "react-dom";

const extractEmbedLink = (url) => {
  if (!url) return "";
  if (url.includes("embed/")) return url;
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  return url;
};

const VideoPage001 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [otherVideos, setOtherVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const fetchedCurrentVideo = await getVideoById(id);
        setCurrentVideo(fetchedCurrentVideo);

        const fetchedAllVideos = await getVideos();
        const remainingVideos = fetchedAllVideos.filter(
          (video) => video.id !== id
        );
        setOtherVideos(remainingVideos);

        const fetchedComments = await getComments(id);
        setComments(fetchedComments);
      } catch (error) {
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const addComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography variant="h4">{error}</Typography>
      </Box>
    );
  }

  if (!currentVideo) {
    return null;
  }

  const videoContainer = document.getElementById("video");

  const onRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log(id, phase, actualDuration, baseDuration);
    console.log(
      `%c${startTime} - ${commitTime}`,
      "color: green; font-size:24px"
    );
  };

  const videoContent = (
    <Profiler id="videoProfiler" onRender={onRenderCallback}>
      <Box sx={{ paddingLeft: "80px" }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box
              sx={{
                width: "100%",
                height: 0,
                paddingBottom: "56.25%",
                position: "relative",
              }}
            >
              <iframe
                src={extractEmbedLink(currentVideo.videoLink)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentVideo.name}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
            <Box sx={{ padding: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h4" sx={{ paddingRight: "10px" }}>
                  {currentVideo.name}
                </Typography>
                <ErrorBoundary>
                  <FollowButton />
                </ErrorBoundary>
                <ErrorBoundary>
                  <LikeButton videoId={id} />
                </ErrorBoundary>
              </Box>
              <Typography variant="body1">
                {currentVideo.productMade}
              </Typography>
              <Typography variant="body1">
                {currentVideo.views.toLocaleString()} views
              </Typography>
            </Box>
            <Box>
              <ErrorBoundary>
                <CommentTube
                  videoId={id}
                  comments={comments}
                  addComment={addComment}
                />
              </ErrorBoundary>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <ErrorBoundary>
              {otherVideos.map((video) => (
                <Card
                  key={video.id}
                  sx={{
                    display: "flex",
                    marginBottom: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleVideoClick(video.id)}
                >
                  <Box sx={{ width: "40%", position: "relative" }}>
                    <iframe
                      src={extractEmbedLink(video.videoLink)}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={video.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                  <Box sx={{ padding: "10px", width: "60%" }}>
                    <Typography variant="h6">{video.name}</Typography>
                    <Typography variant="body2">{video.productMade}</Typography>
                    <Typography variant="body2">
                      {video.views.toLocaleString()} views
                    </Typography>
                  </Box>
                </Card>
              ))}
            </ErrorBoundary>
          </Grid>
        </Grid>
      </Box>
    </Profiler>
  );

  return videoContainer ? createPortal(videoContent, videoContainer) : null;
};

export default VideoPage001;
