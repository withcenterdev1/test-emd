import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabaseClient";

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const { data, error } = await supabase.from("blogs").select("*");
  if (error) throw error;
  return data;
});

export const addBlog = createAsyncThunk("blogs/addBlog", async (blog) => {
  const { data, error } = await supabase.from("blogs").insert([blog]).select();
  if (error) throw error;
  return data[0];
});

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blog }) => {
    const { data, error } = await supabase
      .from("blogs")
      .update(blog)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  }
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw error;
  return id;
});

export const fetchBlogCount = createAsyncThunk(
  "blogs/fetchBlogCount",
  async () => {
    const { count, error } = await supabase
      .from("blogs")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count;
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(
          (blog) => blog.id === action.payload.id
        );
        if (index !== -1) state.blogs[index] = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(fetchBlogCount.fulfilled, (state, action) => {
        state.blogCount = action.payload;
      });
  },
});

export default blogSlice.reducer;
