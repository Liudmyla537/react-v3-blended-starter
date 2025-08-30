import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage, FormikHelpers } from "formik";

import css from "./CreatePostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import { CreatePost } from "../../types/post";

interface CreatePostValues {
  title: string;
  body: string;
}

const initialValues: CreatePostValues = {
  title: "",
  body: "",
};

interface CreatePostFormProps {
  onCancel: () => void;
}

const CreateSchema = Yup.object().shape({
  title: Yup.string().min(3).max(100).required("Title required"),
  body: Yup.string().min(3).max(500).required("Body required"),
});

export default function CreatePostForm({ onCancel }: CreatePostFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreatePost) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onCancel();
    },
  });

  const handleCreateSubmit = (
    values: CreatePostValues,
    actions: FormikHelpers<CreatePostValues>
  ) => {
    console.log(values);
    mutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleCreateSubmit}
      validationSchema={CreateSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
