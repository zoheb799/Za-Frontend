import React, { useState, useRef, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Skeleton } from "primereact/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

const Profile = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser, loading } = useSelector((state) => state.user);

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "",
    avatar: "",
  });

  // For preview URL when avatar is a File object
  const [previewUrl, setPreviewUrl] = useState("");

  // Track if submitting to disable button & show spinner
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.data) {
      setUserData({
        fullName: currentUser.data.fullName || "",
        email: currentUser.data.email || "",
        role: currentUser.data.role || "",
        avatar: currentUser.data.avatar || "",
      });
      setPreviewUrl(currentUser.data.avatar || "");
    }
  }, [currentUser]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      setUserData((prev) => ({
        ...prev,
        avatar: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (value, field) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleProfileUpdate() {
    try {
      setSubmitting(true);

      let avatarUrl = userData.avatar;

      // If avatar is a File object, upload to Cloudinary
      if (userData.avatar && userData.avatar instanceof File) {
        avatarUrl = await uploadToCloudinary(userData.avatar, "profile_avatars");
      }

      // Prepare form data or plain object (depending on your backend)
      const formData = new FormData();
      formData.append("fullName", userData.fullName);
      if (avatarUrl) formData.append("profilePic", avatarUrl);

      const apiResponse = await dispatch(updateUser(formData));

      if (updateUser.fulfilled.match(apiResponse)) {
        toast.success(apiResponse.payload.message || "Profile updated successfully");
      } else {
        toast.error(apiResponse?.payload || "Something went wrong!");
      }
    } catch (err) {
      toast.error("Failed to upload avatar");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const skeletonCard = () => (
    <div className="max-w-[150px] mx-auto">
      <Skeleton shape="circle" size="150px" className="mb-4" />
      <Skeleton width="100%" height="1.5rem" className="mb-3" />
      <Skeleton width="100%" height="1.5rem" className="mb-3" />
      <Skeleton width="100%" height="1.5rem" />
    </div>
  );

  return (
    <div className="profile_parent_wrapper">
      <div className="Profile_wrapper">
        <div className="card max-w-md mx-auto p-6">
          <TabView>
            <TabPanel header="Profile">
              {loading ? (
                skeletonCard()
              ) : (
                <>
                  <div className="profile_input_picker relative w-full max-w-[150px] mx-auto mb-6">
                    <label htmlFor="fileInput" className="profile-pic cursor-pointer">
                      <figure className="group flex justify-center items-center w-[150px] h-[150px] rounded-full overflow-hidden border border-gray-300">
                        <img
                          id="previewImage"
                          className="h-full w-full object-cover"
                          src={previewUrl || "/default-avatar.png"}
                          alt="Profile Picture"
                        />
                      </figure>
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <span
                      onClick={handleClick}
                      className="absolute flex items-center justify-center h-10 w-10 left-[110px] -bottom-0 bg-[#00715d] text-white cursor-pointer rounded-full"
                      title="Change avatar"
                    >
                      <i className="pi pi-pencil"></i>
                    </span>
                  </div>

                  <div className="form_wrapper space-y-5">
                    <div>
                      <p>Full Name</p>
                      <InputText
                        className="w-full"
                        value={userData.fullName}
                        onChange={(e) => handleChange(e.target.value, "fullName")}
                      />
                    </div>
                    <div>
                      <p>Email</p>
                      <InputText className="w-full" disabled value={userData.email} />
                    </div>
                    <div>
                      <p>Role</p>
                      <InputText className="w-full" disabled value={userData.role} />
                    </div>
                  </div>

                  <div className="profile_button mt-6 text-center">
                    <Button
                      label={submitting ? "" : "Submit"}
                      icon={submitting ? "pi pi-spin pi-spinner" : undefined}
                      size="small"
                      className="h-10"
                      severity="success"
                      onClick={handleProfileUpdate}
                      disabled={submitting}
                    />
                  </div>
                </>
              )}
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
};

export default Profile;
