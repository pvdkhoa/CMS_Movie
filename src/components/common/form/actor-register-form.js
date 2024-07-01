import React, { useEffect, useState } from "react";
import { createActor } from "../../../actions/actorAction";
import { Button, Form, Input, Space,Upload } from "antd";
import { useDispatch } from "react-redux";
import { clientAxios } from "../../../config/axios.config";


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};



const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ActorRegisterForm = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [imageFilePath, setImageFilePath] = useState("");
  const [progress, setProgress] = useState(0);

  const onFinish = (values) => {
    const actor = {
      image: imageFilePath,
      filmCharacter: values.filmCharacter,
      name: values.name,
      kind: 0,
      movieId: props.movieID
    };
    dispatch(createActor(actor));
    props.toggleNew();
    props.onLoading();
  };
  const onReset = () => {
    form.resetFields();
    props.toggleNew();
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
  
    // Check if the file is an image file
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      onError({ err: new Error('The uploaded file is not an image file') });
      return;
    }
  
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("file", file);
    fmData.append("type", "image");
    try {
      const res = await clientAxios.post(
        "/v1/file/upload-file/s3",
        fmData,
        config
      );
      onSuccess("Ok");
      console.log("server res: ", res);
      setImageFilePath(res.data.data.filePath);
    } catch (err) {
      console.log("Error: ", err);
      onError({ err: new Error('An error occurred during the image upload') });
    }
  };

  const handleOnChange = ({ file, fileList, event }) => {
    setDefaultFileList(fileList);
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
    >
      {/* Name */}
      <Form.Item
        name="name"
        label="Name Actor's"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* film Character*/}
      <Form.Item
        name="filmCharacter"
        label="Firm Character"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="UploadAvatar"
        label="Upload Avatar"
      >
        <Upload
          accept="image/*"
          customRequest={uploadImage}
          onChange={handleOnChange}
          onPreview={handlePreview}
          listType="picture-card"
          defaultFileList={defaultFileList}
          className="image-upload-grid"
        >
          {defaultFileList.length >= 1 ? null : <div>Upload Image</div>}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form.Item>

      {/* Handle form */}
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default ActorRegisterForm;
