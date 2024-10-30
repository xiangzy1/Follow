import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@follow/components/ui/select/index.jsx"
import { useIsDark, useThemeAtomValue } from "@follow/hooks"
import { IN_ELECTRON } from "@follow/shared/constants"
import { getOS } from "@follow/utils/utils"
import { useTranslation } from "react-i18next"
import { bundledThemesInfo } from "shiki/themes"

import {
  setUISetting,
  useUISettingKey,
  useUISettingSelector,
  useUISettingValue,
} from "~/atoms/settings/ui"
import { setFeedColumnShow, useFeedColumnShow } from "~/atoms/sidebar"
import { isElectronBuild } from "~/constants"
import { useSetTheme } from "~/hooks/common"

import { SettingDescription, SettingSwitch, SettingTabbedSegment } from "../control"
import { createDefineSettingItem } from "../helper/builder"
import { createSettingBuilder } from "../helper/setting-builder"
import { SettingItemGroup } from "../section"
import { ContentFontSelector, UIFontSelector } from "../sections/fonts"

const SettingBuilder = createSettingBuilder(useUISettingValue)
const defineItem = createDefineSettingItem(useUISettingValue, setUISetting)

export const SettingAppearance = () => {
  const { t } = useTranslation("settings")
  return (
    <div className="mt-4">
      <SettingBuilder
        settings={[
          {
            type: "title",
            value: t("appearance.general"),
          },
          AppThemeSegment,

          defineItem("opaqueSidebar", {
            label: t("appearance.opaque_sidebars.label"),
            hide: !window.api?.canWindowBlur,
          }),

          {
            type: "title",
            value: t("appearance.unread_count"),
          },

          defineItem("showDockBadge", {
            label: t("appearance.show_dock_badge.label"),
            hide: !IN_ELECTRON || !["macOS", "Linux"].includes(getOS()),
          }),

          defineItem("sidebarShowUnreadCount", {
            label: t("appearance.sidebar_show_unread_count.label"),
          }),

          {
            type: "title",
            value: t("appearance.sidebar"),
          },
          defineItem("hideExtraBadge", {
            label: t("appearance.hide_extra_badge.label"),
            description: t("appearance.hide_extra_badge.description"),
          }),
          ZenMode,
          ThumbnailRatio,

          {
            type: "title",
            value: t("appearance.fonts"),
          },
          TextSize,
          UIFontSelector,
          ContentFontSelector,
          {
            type: "title",
            value: t("appearance.content"),
          },
          ShikiTheme,

          defineItem("guessCodeLanguage", {
            label: t("appearance.guess_code_language.label"),
            hide: !isElectronBuild,
            description: t("appearance.guess_code_language.description"),
          }),

          defineItem("readerRenderInlineStyle", {
            label: t("appearance.reader_render_inline_style.label"),
            description: t("appearance.reader_render_inline_style.description"),
          }),

          defineItem("hideRecentReader", {
            label: t("appearance.hide_recent_reader.label"),
            description: t("appearance.hide_recent_reader.description"),
          }),

          {
            type: "title",
            value: t("appearance.misc"),
          },

          defineItem("modalOverlay", {
            label: t("appearance.modal_overlay.label"),
            description: t("appearance.modal_overlay.description"),
          }),
          defineItem("reduceMotion", {
            label: t("appearance.reduce_motion.label"),
            description: t("appearance.reduce_motion.description"),
          }),
          defineItem("usePointerCursor", {
            label: t("appearance.use_pointer_cursor.label"),
            description: t("appearance.use_pointer_cursor.description"),
          }),
        ]}
      />
    </div>
  )
}

const ShikiTheme = () => {
  const { t } = useTranslation("settings")
  const isDark = useIsDark()
  const codeHighlightThemeLight = useUISettingKey("codeHighlightThemeLight")
  const codeHighlightThemeDark = useUISettingKey("codeHighlightThemeDark")

  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("appearance.code_highlight_theme")}</span>
      <Select
        defaultValue={isDark ? "github-dark" : "github-light"}
        value={isDark ? codeHighlightThemeDark : codeHighlightThemeLight}
        onValueChange={(value) => {
          if (isDark) {
            setUISetting("codeHighlightThemeDark", value)
          } else {
            setUISetting("codeHighlightThemeLight", value)
          }
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {bundledThemesInfo
            .filter((theme) => theme.type === (isDark ? "dark" : "light"))
            .map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                {theme.displayName}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const textSizeMap = {
  smaller: 15,
  default: 16,
  medium: 18,
  large: 20,
}

export const TextSize = () => {
  const { t } = useTranslation("settings")
  const uiTextSize = useUISettingSelector((state) => state.uiTextSize)

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("appearance.text_size")}</span>
      <Select
        defaultValue={textSizeMap.default.toString()}
        value={uiTextSize.toString() || textSizeMap.default.toString()}
        onValueChange={(value) => {
          setUISetting("uiTextSize", Number.parseInt(value) || textSizeMap.default)
        }}
      >
        <SelectTrigger size="sm" className="w-48 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {Object.entries(textSizeMap).map(([size, value]) => (
            <SelectItem className="capitalize" key={size} value={value.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const AppThemeSegment = () => {
  const { t } = useTranslation("settings")
  const theme = useThemeAtomValue()
  const setTheme = useSetTheme()

  return (
    <SettingTabbedSegment
      key="theme"
      label={t("appearance.theme.label")}
      value={theme}
      values={[
        {
          value: "system",
          label: t("appearance.theme.system"),
          icon: <i className="i-mingcute-monitor-line" />,
        },
        {
          value: "light",
          label: t("appearance.theme.light"),
          icon: <i className="i-mingcute-sun-line" />,
        },
        {
          value: "dark",
          label: t("appearance.theme.dark"),
          icon: <i className="i-mingcute-moon-line" />,
        },
      ]}
      onValueChanged={(value) => {
        setTheme(value as "light" | "dark" | "system")
      }}
    />
  )
}

const ZenMode = () => {
  const { t } = useTranslation("settings")
  const feedColumnShow = useFeedColumnShow()
  const isWideMode = useUISettingKey("wideMode")
  return (
    <SettingItemGroup>
      <SettingSwitch
        checked={!feedColumnShow && isWideMode}
        className="mt-4"
        onCheckedChange={(checked) => {
          if (checked) {
            setFeedColumnShow(false)
            setUISetting("wideMode", true)
          } else {
            setFeedColumnShow(true)
            setUISetting("wideMode", false)
          }
        }}
        label={t("appearance.zen_mode.label")}
      />
      <SettingDescription>{t("appearance.zen_mode.description")}</SettingDescription>
    </SettingItemGroup>
  )
}

const ThumbnailRatio = () => {
  const { t } = useTranslation("settings")

  const thumbnailRatio = useUISettingKey("thumbnailRatio")

  return (
    <SettingItemGroup>
      <div className="mt-4 flex items-center justify-between">
        <span className="shrink-0 text-sm font-medium">
          {t("appearance.thumbnail_ratio.title")}
        </span>
        <Select
          defaultValue="square"
          value={thumbnailRatio}
          onValueChange={(value) => {
            setUISetting("thumbnailRatio", value as "square" | "original")
          }}
        >
          <SelectTrigger size="sm" className="w-48 translate-y-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {["square", "original"].map((ratio) => (
              <SelectItem key={ratio} value={ratio}>
                {t(`appearance.thumbnail_ratio.${ratio as "square" | "original"}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SettingDescription>{t("appearance.thumbnail_ratio.description")}</SettingDescription>
    </SettingItemGroup>
  )
}
