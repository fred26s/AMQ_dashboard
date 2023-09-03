export async function importAllJson() {
    const jsonFiles = import.meta.glob('../data/*.json');
    const jsonObjects = {};

    for (const path in jsonFiles) {
        const module = await jsonFiles[path]();
        const fileName = path.match(/\/([^/]+)\.json$/)[1];
        jsonObjects[fileName] = module.default;
    }

    return jsonObjects;
}

export default importAllJson;
