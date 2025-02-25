import { Button, Flex, Input, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";
import ImageDropzone from "./ImageDropzone";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function EditProfileForm({
  userId,
  nameValue,
  avatar_src,
  cover_src,
  onClose,
  ...props
}) {
  const [name, setName] = useState(nameValue);
  const [nameError, setNameError] = useState(false);
  const [avatar, setAvatar] = useState(avatar_src);
  const [cover, setCover] = useState(cover_src);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [editingField, setEditingField] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleOpenModal = (field) => {
    setEditingField(field);
    open();
  };

  const handleDrop = (files) => {
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);

    if (editingField === "avatar") {
      setAvatar(imageUrl);
      setAvatarFile(file);
    } else if (editingField === "cover") {
      setCover(imageUrl);
      setCoverFile(file);
    }

    close();
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ name, avatar, cover }) => {
      const user = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();
      formData.append("name", name);
      formData.append("avatar", avatarFile);
      formData.append("cover", coverFile);
      const response = await fetch(`${BASE_URL}/user/${userId}/edit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({ name: name, avatar: avatarFile, cover: coverFile });
  };

  const handleClose = () => {
    setAvatarFile(null);
    setCoverFile(null);
    setEditingField(null);
    setAvatar(avatar_src);
    setCover(cover_src);
    onClose();
  };
  return (
    <Modal {...props} onClose={handleClose}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="bg-[#2D2D2D] w-full max-w-2xl rounded-lg shadow-xl">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg">Tên: {name}</h3>
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                  onClick={() => handleOpenModal("name")}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg">Ảnh đại diện</h3>
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                  onClick={() => handleOpenModal("avatar")}
                >
                  Chỉnh sửa
                </button>
              </div>
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <img
                    src={avatar}
                    alt="Profile picture"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Cover Photo Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg">Ảnh bìa</h3>
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                  onClick={() => handleOpenModal("cover")}
                >
                  Chỉnh sửa
                </button>
              </div>
              <div className="w-full h-48 bg-[#1F1F1F] rounded-lg border border-gray-700 flex items-center justify-center">
                <img
                  src={cover}
                  alt="Cover Picture"
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <Button type="submit">Thay đổi trang cá nhân</Button>
      </form>
      <Modal
        opened={opened}
        onClose={close}
        title={editingField != "name" ? "Tải ảnh lên" : "Điên tên"}
      >
        {editingField != "name" && <ImageDropzone onDrop={handleDrop} />}
        {editingField == "name" && (
          <Stack>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            {nameError && (
              <Text fw="bold" c="red">
                Tên không được bỏ trống!!!
              </Text>
            )}

            <Button
              onClick={() => {
                if (name.trim() !== "") {
                  close();
                  setNameError(false);
                } else {
                  setNameError(true);
                }
              }}
            >
              OK
            </Button>
          </Stack>
        )}
      </Modal>
    </Modal>
  );
}
