function clip_data_to_compilation(c) {
    return {
        "download": 0,
        "error": 0,
        "url": c.url,
        "created_at": c.created_at,
        "game_id": c.game_id,
        "game": c.game,
        "creator": c.creator,
        "language": c.language,
        "thumbnail_url": c.thumbnail_url,
        "title": c.title,
        "duration": c.duration,
        "view_count": c.view_count,
    }
}

export default class ClipArray {
    constructor() {
        this.clips = [];
        return this
    }

    fill_from_clips(clips_data) {
        let clips = []
        Object.values(clips_data)
            .forEach((clip) => (
                clips.push(clip_data_to_compilation(clip)
                )
            )
            );
        console.debug(clips)
        this.clips = clips
        return this
    }

    fill_from_compilation(compilation_data) {
        console.debug(`Filling compilation with: ${compilation_data}`)
        for (let i = 0; i < compilation_data.length; i++) {
            this.clips.push(compilation_data[i]);
        }
        console.debug(
            `Filled ClipArray with new total of ${this.clips.length} clips`
        );
        return this
    }

    get amountOfClips() { return this.clips.length };
    get totalDuration() {
        return this.clips.reduce((prev, curr) => prev + curr.duration, 0)
    }

    get isEmpty() { return this.clips.length <= 0 };

    get csv() {
        return this.clips.map((clip) => clip.url).join(',')
    };

    get frequency() {
        if (this.clips.length <= 0) {
            return {}
        }
        let freq = {}
        this.clips.forEach((clip) => freq[clip.creator] = (freq[clip.creator] || 0) + 1)
        return freq
    };

    swap(to, from) {
        const temp = this.clips[to]
        this.clips[to] = this.clips[from]
        this.clips[from] = temp
        return this
    }

    shuffle() {
        this.clips.sort(() => Math.random() - 0.5);
        return this
    }

    removeIndex(index) {
        if (this.isEmpty) {
            console.debug(`The ClipArray is empty!`);
            return this
        }
        if (index === undefined){
            return this
        }
        const removedClip = this.clips.splice(index, 1)[0]
        console.debug(`Removed clip: ${removedClip}`)
        return this
    }

    add(clip) {
        this.clips.push(clip);
        return this
    }

    reverse() {
        this.clips.reverse()
        return this
    }


    indexOfLowN(compilation) {
        let index = this.clips.findIndex(
            (clip) => compilation.frequency[clip.creator] === undefined
        )
        if (index >= 0){
            return index
        }
        for (let i=1; i < 128; i++){
            index = this.clips.findIndex(
                (clip) => compilation.frequency[clip.creator] === i
            )
            if (index >= 0){
                return index
            }
        }
        return undefined
    }
    indexOfMostViews() {
        return 0
    }

}
