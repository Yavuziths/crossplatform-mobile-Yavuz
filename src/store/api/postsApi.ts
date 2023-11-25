// src/store/api/postsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { db } from "../../../firebase-config";
// Import relevant methods from Firebase

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "posts",
      transformResponse: (response) => {
        // Transform the response to the format your app expects
        return response;
      },
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "posts",
        method: "POST",
        body: newPost,
      }),
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),
    }),
    // Add other endpoints as needed
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  // Add other hooks as necessary
} = postsApi;
