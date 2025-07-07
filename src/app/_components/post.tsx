"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
    const utils = api.useUtils();

    return <div className="w-full max-w-xs">123123</div>;
}
