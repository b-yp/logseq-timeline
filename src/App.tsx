import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import React, { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { formatName, useAppVisible } from "./utils";

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();
  const [tags, setTags] = React.useState<PageEntity[]>([]);
  const [tag, setTag] = React.useState(tags[0]?.uuid);

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

    const linkedRefs = await logseq.Editor.getPageLinkedReferences(
      "64db17b7-5a69-475c-ab9b-83e0da033a99"
    );

    console.log("linkedRefs", linkedRefs);
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
    console.log("tag", tag);
    return (
      <main className="logseq-timeline-main">
        <div ref={innerRef} className="text-size-2em">
          Welcome to [[Logseq]] Plugins!
          <button
            onClick={() => {
              window.logseq.hideMainUI();
            }}
          >
            关闭按钮
          </button>
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
          </div>
        </div>
      </main>
    );
  }
  return null;
}

export default App;
