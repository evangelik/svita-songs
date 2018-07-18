import { fromJS, List } from "immutable";

export function push(fieldName, element) {
  return immutableObj =>
      immutableObj.updateIn([fieldName], list => {
        if (list && !List.isList(list)) {
          throw new Error("Not an Immutable.List for field name: " + fieldName);
        }

        return (list || List([])).push(fromJS(element));
      });
}

export function pop(fieldName) {
  return immutableObj => {
    const list = immutableObj.get(fieldName);

    if (!list) {
      return immutableObj;
    }

    if (!List.isList(list)) {
      throw new Error("Not an Immutable.List for field name: " + fieldName);
    }

    return list.size > 1
        ? immutableObj.set(fieldName, list.pop())
        : immutableObj.delete(fieldName);
  }
}
