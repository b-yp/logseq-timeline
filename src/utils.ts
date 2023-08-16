import { BlockEntity, LSPluginUserEvents, PageEntity } from "@logseq/libs/dist/LSPlugin.user";

import dayjs from "dayjs";
import React from "react";
import { TimelineItem } from 'react-chrono'

import { Property } from "./types";

let _visible = logseq.isMainUIVisible;

function subscribeLogseqEvent<T extends LSPluginUserEvents>(
  eventName: T,
  handler: (...args: any) => void
) {
  logseq.on(eventName, handler);
  return () => {
    logseq.off(eventName, handler);
  };
}

const subscribeToUIVisible = (onChange: () => void) =>
  subscribeLogseqEvent("ui:visible:changed", ({ visible }) => {
    _visible = visible;
    onChange();
  });

export const useAppVisible = () => {
  return React.useSyncExternalStore(subscribeToUIVisible, () => _visible);
};

export const genRandomStr = () => Math.random().
  toString(36).
  replace(/[^a-z]+/g, '').
  substring(0, 5)


export const formatName = (tagName: string): string => tagName.replace('.timeline_', '')

export const formatTimeLine = (linkedRefs: [page: PageEntity, blocks: BlockEntity[]][] | null): TimelineItem[] => {
  if (!linkedRefs) return []
  const allBlocks: BlockEntity[] = []
  linkedRefs.forEach(([_page, block]) => {
    allBlocks.push(...block)
  })

  const items: ({ title?: string } & Property)[] = allBlocks.map(block => ({
    title: block.content.split('#.timeline_')[0],
    ...(block.properties as Property),
  }))

  items.sort((a, b) => dayjs(a.time).isBefore(b.time) ? -1 : 1)

  return items.map(i => ({
    title: i.title,
    timelineContent: i.content,
  }))
}
