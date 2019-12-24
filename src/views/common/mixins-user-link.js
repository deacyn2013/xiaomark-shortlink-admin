export default {
  data() {
    const C_GREEN = '#47cb89'
    const C_BLUE = '#4F87FB'
    const C_ORANGE = '#e88986'
    const C_GREY = '#c5c8ce'
    const SOURCE_MAP = [
      {},
      {
        name: '网页',
        icon: 'i-pc',
        color: C_ORANGE
      },
      {
        name: '小程序',
        icon: 'i-wx',
        color: C_BLUE
      },
      {
        name: '浏览器插件',
        icon: 'i-extention',
        color: C_GREEN
      }
    ]

    return {
      loading: true,
      tableColumns: [
        [
          {
            title: '短链名称',
            minWidth: 150,
            key: 'name'
          },
          {
            title: '短链',
            minWidth: 180,
            key: 'url'
          },
          {
            title: '创建时间',
            minWidth: 120,
            key: 'create_time',
            render: (h, { row }) => {
              const arr = this.$PDo.Date.format(row.create_time).split(' ')

              return (
                <span>
                  {arr[0]}
                  {arr[1] && this.$bus.view_width <= 1300 ? <br /> : ' '}
                  {arr[1]}
                </span>
              )
            }
          },
          {
            title: '跳转链接',
            width: 156,
            tooltip: true,
            key: 'origin_url',
            render: (h, { row }) => {
              /* eslint-disable */
              const arr_a = row.mode === 0 ? [] : (row.origin_url_list || []).map((item, index) => (
                <p>
                  <span>【{index + 1}】</span>
                  <a
                    target="_blank"
                    href={item.url}
                    rel="noreferrer"
                    >
                    {item.url}
                  </a>
                </p>
              ))

              return (
                <Tooltip placement="bottom" max-width={500} theme="light">
                  {
                    row.mode === 0 
                    ? <a
                      target="_blank"
                      href={row.origin_url}
                      rel="noreferrer"
                      class="text--oneRow"
                      style="width: 120px;display: inline-block;"
                      >
                        {row.origin_url}
                      </a>
                    : <span class="cp" style="color: #2D8cF0;">随机_{row.mode === 1 ? '' : '非'}记忆</span>
                  }
                  <div slot="content">
                    {
                      row.mode === 0 
                      ? <a
                        target="_blank"
                        href={row.origin_url}
                        rel="noreferrer"
                        >
                          {row.origin_url}
                        </a>
                      : arr_a
                    }
                  </div>
                </Tooltip>
              )
              /* eslint-enable */
            }
          },
          {
            title: '访问次数 / 人数 / IP数',
            minWidth: 160,
            format: this.$global.utils.countFormat.three,
            render: (h, { row }) => {
              const n_clicks = this.$global.utils.countFormat.three(
                row.n_clicks
              )
              const n_visitors = this.$global.utils.countFormat.three(
                row.n_visitors
              )
              const n_ips = this.$global.utils.countFormat.three(row.n_ips)

              return (
                <div class="cp">
                  <span class="text-visit" title="次数">
                    {n_clicks}
                  </span>
                  <span> / </span>
                  <span class="text-visit" title="人数">
                    {n_visitors}
                  </span>
                  <span> / </span>
                  <span class="text-visit" title="IP数">
                    {n_ips}
                  </span>
                </div>
              )
            }
          },
          {
            title: '来源',
            minWidth: 80,
            key: 'source',
            render: (h, { row }) => {
              return (
                <div>
                  <span class="mr8" title={SOURCE_MAP[row.source].name || '--'}>
                    <itv-icon
                      type={SOURCE_MAP[row.source].icon || '--'}
                      style={{ color: SOURCE_MAP[row.source].color || '--' }}
                      size="24"
                    />
                  </span>
                </div>
              )
            }
          }
        ],
        [
          {
            title: '创建者',
            minWidth: 160,
            key: 'user.nickname user.headimgurl',
            render: (h, { row }) => {
              return (
                <div
                  class="table-cell__nickname table-cell__nickname--click"
                  onClick={this.toUserDetail.bind(null, row)}
                >
                  <img src={row.user.headimgurl} class="img--headimgurl mr8" />
                  <span class="text--nickname">{row.user.nickname}</span>
                </div>
              )
            }
          }
        ],
        [
          {
            title: '是否可用',
            minWidth: 120,
            key: 'enabled',
            // eslint-disable-next-line no-unused-vars
            renderHeader: (h) => {
              const options = [
                { name: '全部', value: '' },
                { name: '可用', value: 1 },
                { name: '不可用', value: 0 }
              ]
              const optionsList = options.map((item) => {
                return (
                  <DropdownItem
                    class={
                      // eslint-disable-next-line prettier/prettier
                      this.form.enabled === item.value ? 'enabled_active enabled_item' : 'enabled_item'
                    }
                  >
                    <span
                      class="enabled_span"
                      onClick={() => {
                        this.form.enabled = item.value
                        this.doGetData()
                      }}
                    >
                      {item.name}
                    </span>
                  </DropdownItem>
                )
              })

              return (
                <Dropdown>
                  <div>
                    <span class="mr8">是否可用</span>
                    <Icon type="ios-funnel" title="筛选" />
                  </div>
                  <DropdownMenu slot="list">{optionsList}</DropdownMenu>
                </Dropdown>
              )
            },
            render: (h, { row }) => {
              return (
                <Icon
                  title={row.enabled ? '可用' : '不可用'}
                  type="md-checkmark-circle"
                  color={row.enabled ? C_GREEN : C_GREY}
                  size="20"
                />
              )
            }
          },
          {
            title: '是否归档',
            minWidth: 120,
            key: '',
            // eslint-disable-next-line no-unused-vars
            // renderHeader: (h) => {
            //   const options = [
            //     { name: '全部', value: '' },
            //     { name: '可用', value: 1 },
            //     { name: '不可用', value: 0 }
            //   ]
            //   const optionsList = options.map((item) => {
            //     return (
            //       <DropdownItem
            //         class={
            //           // eslint-disable-next-line prettier/prettier
            //           this.form.enabled === item.value ? 'enabled_active enabled_item' : 'enabled_item'
            //         }
            //       >
            //         <span
            //           class="enabled_span"
            //           onClick={() => {
            //             this.form.enabled = item.value
            //             this.doGetData()
            //           }}
            //         >
            //           {item.name}
            //         </span>
            //       </DropdownItem>
            //     )
            //   })

            //   return (
            //     <Dropdown>
            //       <div>
            //         <span class="mr8">是否归档</span>
            //         <Icon type="ios-funnel" title="筛选" />
            //       </div>
            //       <DropdownMenu slot="list">{optionsList}</DropdownMenu>
            //     </Dropdown>
            //   )
            // },
            render: (h, { row }) => {
              return (
                <Icon
                  title={row.enabled ? '可用' : '不可用'}
                  type="md-checkmark-circle"
                  color={row.enabled ? C_GREEN : C_GREY}
                  size="20"
                />
              )
            }
          }
        ]
      ],
      table: {
        data: [],
        total: 0,
        columns: [],
        height: null // 表格的高度
      },
      options: {
        sort: [
          { value: 'time', label: '按创建时间倒序' },
          { value: 'click', label: '按访问次数倒序' },
          { value: 'visitor', label: '按访问人数倒序' },
          { value: 'ip', label: '按访问IP数倒序' }
        ]
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.table.height = this.$refs.refTable.$el.clientHeight
    })
    console.log(this.$route.name)
    /* eslint-disable */
    this.table.columns = this.$route.name === 'UserDetail'
      ? [...this.tableColumns[0], ...this.tableColumns[2]]
      : [ ...this.tableColumns[0],
          ...this.tableColumns[1],
          ...this.tableColumns[2]
        ]
    /* eslint-enable */
  },
  watch: {},
  methods: {
    domTableScrollTop() {
      // 表格回滚到顶部
      this.$refs.refTable &&
        this.$refs.refTable.$refs.body &&
        (this.$refs.refTable.$refs.body.scrollTop = 0)
    }
  }
}