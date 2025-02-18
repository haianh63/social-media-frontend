import { Group, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Upload, X, Image } from "lucide-react";

export default function ImageDropzone(props) {
  return (
    <Dropzone maxSize={1 * 1024 ** 2} accept={IMAGE_MIME_TYPE} {...props}>
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <Upload
            size={52}
            color="var(--mantine-color-blue-6)"
            strokeWidth={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <X size={52} color="var(--mantine-color-red-6)" strokeWidth={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <Image
            size={52}
            color="var(--mantine-color-dimmed)"
            strokeWidth={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 1mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
