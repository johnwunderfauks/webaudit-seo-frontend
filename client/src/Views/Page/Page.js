import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { Helmet } from "react-helmet";
import { Box } from "@mui/system";
import { Skeleton, Typography } from "@mui/material";
import NotFound from "../NotFound";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Page = (props) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [errorImg, setErrorImg] = useState(false);
  const params = useParams();

  const pro_url = "https://webaudit-strapi.herokuapp.com";
  const dev_url = "http://localhost:1337";

  let cloneParams = { ...params };

  // const {
  //   loading,
  //   error: fetchError,
  //   data: resData,
  // } = useFetch(
  //   `${pro_url}/api/pages?filters[title][$eqi]=${cloneParams.title.replace(
  //     "-",
  //     " "
  //   )}&populate=deep`
  // );

  const {
    loading,
    error: fetchError,
    data: resData,
  } = useFetch(
    `${pro_url}/api/pages?filters\[permalink\][$eq]=${cloneParams.title}&populate=deep`
    // `${pro_url}/api/pages?filters[permalink][$eqi]=${cloneParams.title}&populate=deep`
  );

  useEffect(() => {
    let updatedTitle = params.title.replace(" ", "-");
    window.history.pushState(
      {},
      null,
      window.location.origin + "/" + params.title.replace(" ", "-")
    );
  }, [params]);

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

  if (
    resData.data.length === 0 ||
    resData?.error?.message === "Not Found" ||
    resData === null
  ) {
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

  const { data: dataArr, meta } = resData;

  if (dataArr && dataArr.length > 0) {
    const data = dataArr[0];

    console.log(data);

    return (
      <div>
        <Helmet>
          <title>{data.attributes.seo[0]?.metaTitle}</title>
          <meta
            name="description"
            content={data.attributes.seo[0]?.metaDescription}
          />
        </Helmet>
        <Box sx={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          {data?.attributes?.image?.data?.attributes.url && (
            <Box sx={{ height: 500 }}>
              {!isImageLoaded && (
                <Skeleton variant="rounded" width="auto" height={530} />
              )}

              <img
                src={`${pro_url}${data.attributes.image.data.attributes.url}`}
                alt={errorImg ? "Image is not Loaded" : data.attributes.title}
                width="100%"
                height="100%"
                onLoad={() => setIsImageLoaded(true)}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  setErrorImg(true);
                  setIsImageLoaded(true);
                }}
                style={{
                  borderRadius: 4,
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Box>
          )}

          <Typography variant="h4" component="h1" fontWeight="bold" mt={6}>
            {data.attributes.title}
          </Typography>
          {/* <Typography
            variant="body1"
            mt={3}
            gutterBottom
            sx={{ lineHeight: 2 }}
          > */}
          <Typography
            variant="body1"
            mt={3}
            gutterBottom
            sx={{ lineHeight: 2 }}
          >
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              children={data.attributes.content}
              escapeHtml={false}
              components={{
                img: ({ node, ...props }) => {
                  return (
                    <Box style={{ height: "300px" }}>
                      <img
                        src={`${pro_url}${node.properties.src}`}
                        width="100%"
                        height="100%"
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                  );
                },
                a: ({ node, ...props }) => <a target="_blank" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <div
                    style={{
                      borderLeft: "6px solid #ccc",
                      paddingLeft: 10,
                    }}
                    {...props}
                  />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    style={{
                      backgroundColor: "#ccc",
                    }}
                    {...props}
                  />
                ),
              }}
            />
          </Typography>
        </Box>
      </div>
    );
  }
};

export default Page;