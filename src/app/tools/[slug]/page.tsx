import React from "react";
import { notFound } from "next/navigation";
import { getToolBySlug, TOOLS } from "@/lib/registry";
import ToolWorkspace from "@/components/ToolWorkspace";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found — PI Hub",
    };
  }

  return {
    title: `${tool.name} — PI Hub (Free Online Tool)`,
    description: tool.shortDesc,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolWorkspace tool={tool} />;
}
