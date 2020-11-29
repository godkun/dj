type fullClassName = string
type clsName = string

export interface ICount {
  offset: number
  map: {
    [k in fullClassName]: clsName
  }
}

export default class Deps {
  private map: Map<string, ICount> = new Map()

  add(fullClssName: string, clsName: string) {
    let val = this.map.get(clsName)

    if (val) {
      // 如果已经存在
      const existClsName = val.map[fullClssName]
      if (existClsName) {
        return existClsName
      }

      // 不存在
      const renameClsName = `${clsName}${val.offset}`
      val.map[fullClssName] = renameClsName
      val.offset++
      return renameClsName
    } else {
      this.map.set(clsName, {
        offset: 1,
        map: { [fullClssName]: clsName },
      })
    }

    return clsName
  }

  get imports() {
    const imports = []
    for (let { map } of this.map.values()) {
      for (let [fullClassName, clsName] of Object.entries(map)) {
        imports.push(`
        import ${clsName} from '${fullClassName}';
        `)
      }
    }
    return imports
  }
}