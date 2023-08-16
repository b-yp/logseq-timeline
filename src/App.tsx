import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import React, { useEffect } from "react";
import { Chrono, TimelineItem } from "react-chrono";
import MarkdownPreview from "@uiw/react-markdown-preview";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";

import { formatName, formatTimeLine, useAppVisible } from "./utils";

const Markdown = (i: string) => {
  return <MarkdownPreview source={i} />;
};

function App() {
  const visible = useAppVisible();
  const [tags, setTags] = React.useState<PageEntity[]>([]);
  const [tag, setTag] = React.useState(tags[0]?.uuid);
  const [timelineItems, setTimelineItems] = React.useState<TimelineItem[]>([]);

  const getAllTags = async () => {
    // 查询所有以 .timeline_ 开头的 tag
    const query = `
      [:find (pull ?block [*])
       :where
        [?block :block/name ?pagename]
        [(clojure.string/starts-with? ?pagename ".timeline_")]
      ]
    `;
    const tags = await logseq.DB.datascriptQuery(query);
    setTags(tags.map((i: PageEntity[]) => i[0]));
  };

  const getAllBlocks = async () => {
    // 查询当前选择 tag 的所有 block
    // TODO: 不知道为什么，这个 query 在本地测试没问题，在 api 中就报错
    // const query = `
    //   [:find (pull ?block [*])
    //    :where
    //     [?block :block/content ?blockcontent]
    //     [?block :block/page ?page]
    //     [?page :block/name ?pagename]
    //     (page-ref ?block "${tag}")
    //   ]
    // `;
    // const blocks = await logseq.DB.datascriptQuery(query);

    const linkedRefs = await logseq.Editor.getPageLinkedReferences(tag);
    const items = formatTimeLine(linkedRefs);
    setTimelineItems(items);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setTag(event.target.value as string);
  };

  useEffect(() => {
    getAllTags();
  }, [visible]);

  useEffect(() => {
    if (!tags?.length) {
      return;
    }
    setTag(tags[0]?.uuid);
  }, [tags]);

  useEffect(() => {
    if (!tag) {
      return;
    }
    getAllBlocks();
  }, [tag]);

  if (visible) {
    return (
      <main className="logseq-timeline-main">
        <div className="tool-bar">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="select-timeline">Select Timeline</InputLabel>
              <Select
                labelId="select-timeline"
                value={tag}
                label="Select Timeline"
                onChange={handleChange}
              >
                {!!tags.length &&
                  tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.uuid}>
                      {formatName(tag.name)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              window.logseq.hideMainUI();
            }}
          >
            关闭
          </Button>
        </div>
        <div className="container">
          <Chrono
            items={timelineItems.map((i) => ({
              ...i,
              timelineContent: Markdown(i.timelineContent as string),
            }))}
          />
        </div>
      </main>
    );
  }
  return null;
}

export default App;
