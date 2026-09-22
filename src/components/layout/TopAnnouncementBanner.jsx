import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { DEFAULT_ANNOUNCEMENT } from "../../config/businessInfo.js";

export default function TopAnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);

  useEffect(() => {
    let isMounted = true;
    dbService.getAnnouncement().then((data) => {
      if (isMounted && data) {
        setAnnouncement(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!announcement || !announcement.isActive) {
    return null;
  }

  return (
    <div className="top-announcement-bar" id="topAnnouncementBar">
      <div className="container announcement-inner">
        <div className="announcement-left">
          <span className="announcement-sparkle" id="announcementIcon">
            {announcement.icon || "✨"}
          </span>
          <span className="announcement-highlight" id="announcementTitle">
            {announcement.title}
          </span>
          <span className="announcement-venues" id="announcementMessage">
            {announcement.message}
          </span>
        </div>
        <div className="announcement-right" id="announcementRightGroup">
          {announcement.badge && (
            <span className="announcement-badge" id="announcementBadge">
              {announcement.badge}
            </span>
          )}
          {announcement.subtext && (
            <>
              <span className="announcement-dot" id="announcementDot">
                •
              </span>
              <span id="announcementSubtext">{announcement.subtext}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
