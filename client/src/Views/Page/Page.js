import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { Helmet } from "react-helmet";
import { Box } from "@mui/system";
import { Skeleton, Typography } from "@mui/material";
import NotFound from "../NotFound";

const Page = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const params = useParams();

  console.log(process.env)

  const {
    loading,
    error: fetchError,
    data: resData,
  } = useFetch(`${process.env.REACT_APP_STRAPI_API}/api/pages/${params.id}?populate=deep`);

  if (loading) {
    return (
      <div>
        <Box sx={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          <Skeleton variant="rounded" width="auto" height={530} />
          <Skeleton width={150} height={60} />
        </Box>
      </div>
    );
  }
  console.log(resData);
  if (resData?.error?.message === "Not Found") {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="75vh"
      >
        <Typography variant="h1" component="h3">
          404 Not Found.
        </Typography>
      </Box>
    );
  }
  if (resData?.error?.message === "Internal Server Error") {
    return <NotFound />;
  }
  const { data, meta } = resData;
  if (data) {
    return (
      <div>
        <Helmet>
          <title>{data.attributes.seo[0].metaTitle}</title>
          <meta
            name="description"
            content={data.attributes.seo[0].metaDescription}
          />
        </Helmet>
        <Box sx={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          <Box sx={{ maxHeight: 500 }}>
            {!isImageLoaded && (
              <Skeleton variant="rounded" width="auto" height={530} />
            )}
            <img
              src={`${process.env.REACT_APP_STRAPI_API}${data.attributes.image.data.attributes.url}`}
              alt="Image Test"
              width="100%"
              height="100%"
              onLoad={() => setIsImageLoaded(true)}
              style={{ borderRadius: 4 }}
            />
          </Box>
          <Typography variant="h4" component="h1" fontWeight="bold" mt={6}>
            {data.attributes.title}
          </Typography>
          <Typography
            variant="body1"
            mt={3}
            gutterBottom
            sx={{ lineHeight: 2 }}
          >
            {data.attributes.content}
          </Typography>
        </Box>
      </div>
    );
  }
};

export default Page;
