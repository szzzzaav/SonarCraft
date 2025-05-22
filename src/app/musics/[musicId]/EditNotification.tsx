"use client";

import { useOthers } from "@liveblocks/react";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

// 内部定义类型，避免模块导入问题
type EditingTrackInfo = {
  instrumentId: number | null;
  instrumentName: string;
};

interface UserPresence {
  selectedId: number | null;
  editingTrack?: EditingTrackInfo;
}

export const EditNotification = () => {
  const others = useOthers();
  const previousEditingTracksRef = useRef<Map<string, EditingTrackInfo>>(new Map());

  useEffect(() => {
    // 追踪其他用户的编辑行为
    others.forEach((user) => {
      const userId = user.id;
      // 使用类型断言
      const presence = user.presence as UserPresence;

      // 如果没有编辑信息，跳过
      if (!presence.editingTrack) return;

      const currentEditingTrack = presence.editingTrack;
      const previousEditingTrack = previousEditingTracksRef.current.get(userId);

      // 只有当用户选择了一个新的音轨，并且与之前不同时才显示通知
      if (
        currentEditingTrack.instrumentId !== null &&
        (!previousEditingTrack ||
          previousEditingTrack.instrumentId !== currentEditingTrack.instrumentId)
      ) {
        // 显示提醒通知
        toast.success(
          `${user.info?.email || "未知用户"} 正在编辑 ${currentEditingTrack.instrumentName} 音轨`,
          {
            id: `editing-${userId}-${currentEditingTrack.instrumentId}`,
            duration: 3000,
            className: "edit-notification-toast",
            icon: "🎵",
          }
        );
      }

      // 更新记录
      if (currentEditingTrack.instrumentId !== null) {
        previousEditingTracksRef.current.set(userId, currentEditingTrack);
      }
    });
  }, [others]);

  // 这个组件不需要渲染任何内容
  return null;
};

export default EditNotification;
