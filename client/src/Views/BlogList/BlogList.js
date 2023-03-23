import { Pagination, Paper, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useHistory } from "react-router-dom";
import moment from "moment";

const BlogList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const dev_url = "http://localhost:1337";
  const pro_url = "https://webaudit-strapi.herokuapp.com";
  const {
    loading,
    error: fetchError,
    data: resData,
  } = useFetch(
    `${pro_url}/api/pages?pagination[page]=${currentPage}&pagination[pageSize]=10&populate=deep`
  );

  if (loading) {
    return (
      <div>
        {[0, 1, 2, 3].map((index) => (
          <Box
            sx={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}
            key={index}
            mt={2}
          >
            <Skeleton variant="rounded" width="auto" height={100} />
          </Box>
        ))}
      </div>
    );
  }
  return (
    <Box sx={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
      {resData &&
        resData?.data.map((item) => {
          return (
            <Paper
              sx={{
                padding: 2,
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(0,0,0,.03)",
                },
                marginBottom: 2,
              }}
              key={item.id}
              onClick={() => navigate("/" + item.attributes.permalink)}
            >
              <Box display="flex" alignItems="center">
                <Box
                  width={100}
                  sx={{
                    marginRight: 2,
                  }}
                >
                  {item.attributes.image.data ? (
                    <img
                      src={`${pro_url}${item.attributes.image.data.attributes.url}`}
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alingItems="center"
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          border: "1px solid rgb(134, 142, 150)",
                          width: 100,
                          padding: "12px 4px",
                          textAlign: "center",
                          borderRadius: 1,
                        }}
                      >
                        {" "}
                        {item.attributes.title[0]}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box>
                  <Typography variant="body1">
                    {item.attributes.title}
                  </Typography>
                  <Typography variant="body2" color="rgb(134, 142, 150)" mt={1}>
                    Published •{" "}
                    {moment(item.attributes.publishedAt).format("MMM DD, YYYY")}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          );
        })}
      <Box display="flex" justifyContent="flex-end" mt={6}>
        <Pagination
          count={resData?.meta?.pagination?.pageCount}
          color="primary"
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
        />
      </Box>
    </Box>
  );
};

export default BlogList;
