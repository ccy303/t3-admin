"use client";
import { Modal } from "antd";
import React, { useState } from "react";
import { createStyles } from "antd-style";

import type { ModalProps } from "antd";

const useStyles = createStyles(({ css, token }) => {
  return {
    modalContent: css`
      padding: 0 16px !important;
    `,
    modalHeader: css`
      padding: 16px 0 10px !important;
      border-bottom: 1px solid ${token.colorBorder} !important;
      margin-bottom: 16px !important;
    `,
    modalBody: css``,
    modalFooter: css`
      border-top: 1px solid ${token.colorBorder} !important;
      padding: 16px 0 !important;
    `,
  };
});

export default React.forwardRef(
  ({ children, ...modalProps }: Readonly<{ children: React.ReactNode } & ModalProps>, ref) => {
    const [open, setOpen] = useState(false);
    const { styles } = useStyles();

    React.useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    // -----------modalProps beign-----------
    const { onOk, onCancel, ...other } = modalProps;
    // -----------modalProps end-----------

    // -----------handle beign-----------
    const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
      await onOk?.(e);
      setOpen(false);
    };
    const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
      await onCancel?.(e);
      setOpen(false);
    };
    // -----------handle end-----------

    return (
      <Modal
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnHidden
        maskClosable={false}
        classNames={{
          content: styles.modalContent,
          header: styles.modalHeader,
          body: styles.modalBody,
          footer: styles.modalFooter,
        }}
        {...other}
      >
        {children}
      </Modal>
    );
  },
);
