"use client";

import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import Form from "~/app/_components/Form";
import type { FormItem } from "../Form";
import type { Search } from "./index";
import { v4 as uuidv4 } from "uuid";

const ACTION_SPAN = 4;
const ROW_SPAN = 24;

type Props = {
  items: Search[];
  children?: React.ReactNode;
  onSearch: (data: any) => void;
  onReset: () => void;
};

export default React.memo(({ items = [], onSearch, onReset }: Props) => {
  const searchParams = useSearchParams().get("query");

  const [isCollapse, setIsCollapse] = useState<Boolean>(false);
  const [formItem, setFormItem] = useState<Search[]>([]);

  // 控制过度动画
  const [maxHieght, setMaxHieght] = useState("auto");

  let rowCount = 1; // 全部展开时加上按钮渲染的行数，默认一行
  const ref = useRef<any>(null);

  // 获取最后一行剩余 col-span， 每行 24 份
  const restColSpan = items.reduce((pre, cur) => {
    if (pre >= (cur.span || 0)) {
      return pre - (cur.span || 0);
    } else {
      rowCount += 1;
      return 24 - (cur.span || 0);
    }
  }, ROW_SPAN);

  // 按钮操作行
  if (restColSpan < ACTION_SPAN) {
    rowCount += 1;
  }

  const getActions = (offset: number) => {
    return {
      type: "render",
      span: ACTION_SPAN,
      offset: offset,
      render() {
        return (
          <div className="flex justify-end gap-[10px]" key={`actions-${uuidv4()}`}>
            <Button
              type="default"
              onClick={() => {
                ref.current.resetFields();
                onReset();
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                const data = ref.current.getFieldsValue(true);

                const res: any = {};

                for (let key in data) {
                  const { operator } = items.find((it: Search) => it.name === key) || {};
                  res[key as string] = {
                    value: data[key],
                    operator: operator || "equals",
                  };
                }
                onSearch(res);
              }}
            >
              查询
            </Button>
            {rowCount > 1 && (
              <Button
                iconPosition="end"
                type="link"
                icon={
                  isCollapse ? (
                    <RiArrowUpSLine size={18} className="mt-[3px]" />
                  ) : (
                    <RiArrowDownSLine size={18} className="mt-[3px]" />
                  )
                }
                onClick={() => setIsCollapse(!isCollapse)}
              >
                {isCollapse ? "收起" : "展开"}
              </Button>
            )}
          </div>
        );
      },
    };
  };

  useEffect(() => {
    if (isCollapse) {
      setFormItem([...items, getActions((restColSpan < ACTION_SPAN ? ROW_SPAN : restColSpan) - ACTION_SPAN)]);
    } else {
      const _items: Search[] = [];
      let span = 0;
      for (let i = 0, it; (it = items[i++]); ) {
        const _it = { ...it };
        if (span + (_it.span || 0) < ROW_SPAN - ACTION_SPAN) {
          span += _it.span || 0;
        } else {
          _it.span = 0;
        }
        _items.push(_it);
      }
      setFormItem([..._items, getActions(ROW_SPAN - span - ACTION_SPAN)]);
    }

    setTimeout(() => {
      const formItemHeight = ref.current.nativeElement.querySelector(".ant-col").offsetHeight;
      if (isCollapse) {
        // 乘于二以确保有足够的高度
        setMaxHieght(`${rowCount * 2 * formItemHeight}px`);
      } else {
        setMaxHieght(`${formItemHeight}px`);
      }
    });
  }, [isCollapse]);

  return (
    <div className="mb-[20px] border-b-1 border-solid border-gray-200 pb-[20px]">
      <Form
        ref={ref}
        items={[formItem as FormItem[]]}
        config={{
          layout: "inline",
          className: "transition-max-h duration-500 ease-in-out",
          style: { maxHeight: maxHieght },
          initialValues: (() => {
            const res: any = {};
            if (searchParams) {
              const data = JSON.parse(searchParams);
              for (let key in data) {
                res[key] = data[key].value;
              }
            }
            return res;
          })(),
        }}
      ></Form>
    </div>
  );
});
