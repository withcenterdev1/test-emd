import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabaseClient";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    console.log("Email:", user, "Password:", password);
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const { data, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) throw roleError;

    return { user, role: data?.role || "user" };
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ email, password }) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id, is_deleted")
      .eq("id", user.id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existingUser && existingUser.is_deleted) {
      throw new Error(
        "Ang account na ito ay na-delete at hindi na maaaring gamitin muli."
      );
    }

    const { data: userData, error: selectExistingError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (selectExistingError) throw selectExistingError;

    if (!userData) {
      const { error: insertError } = await supabase
        .from("users")
        .upsert({ id: user.id, email, role: "user" });
      if (insertError) throw insertError;
    } else {
      const { error: updateError } = await supabase
        .from("users")
        .update({ email, role: "user" })
        .eq("id", user.id);
      if (updateError) throw updateError;
    }

    return { user, role: "user" };
  }
);

export const editUser = createAsyncThunk(
  "auth/editUser",
  async ({ user_id, email, full_name, role }) => {
    const { error } = await supabase
      .from("users")
      .update({ email, full_name, role })
      .eq("id", user_id);

    if (error) throw error;

    return { user_id, email, full_name, role };
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return;
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ full_name, password, user_id }) => {
    const { error } = await supabase
      .from("users")
      .update({ full_name, password })
      .eq("id", user_id);

    if (error) throw error;

    return { full_name, password };
  }
);

export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
  }
);

export const updateUserRole = createAsyncThunk(
  "auth/updateUserRole",
  async ({ user_id, role }) => {
    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", user_id);

    if (error) throw error;

    return { user_id, role };
  }
);

export const deleteUser = createAsyncThunk("auth/deleteUser", async (id) => {
  const user_id = id;

  const { error } = await supabase
    .from("users")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  return user_id;
});

export const fetchUserCount = createAsyncThunk(
  "auth/fetchUserCount",
  async () => {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return count;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: "user",
    status: "idle",
    error: null,
    users: [],
    userCount: 0,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user.full_name = action.payload.full_name;
        state.user.password = action.payload.password;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = state.users.find(
          (user) => user.id === action.payload.user_id
        );
        if (updatedUser) {
          updatedUser.role = action.payload.role;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(editUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = "user";
      })
      .addCase(fetchUserCount.fulfilled, (state, action) => {
        state.userCount = action.payload;
      })
      .addCase(fetchUserCount.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});
export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;
