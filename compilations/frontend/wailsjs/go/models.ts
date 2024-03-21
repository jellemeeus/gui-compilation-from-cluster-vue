export namespace helix {
	
	export class Clip {
	    id: string;
	    url: string;
	    embed_url: string;
	    broadcaster_id: string;
	    broadcaster_name: string;
	    creator_id: string;
	    creator_name: string;
	    duration: number;
	    video_id: string;
	    game_id: string;
	    language: string;
	    title: string;
	    view_count: number;
	    created_at: string;
	    thumbnail_url: string;
	
	    static createFrom(source: any = {}) {
	        return new Clip(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.url = source["url"];
	        this.embed_url = source["embed_url"];
	        this.broadcaster_id = source["broadcaster_id"];
	        this.broadcaster_name = source["broadcaster_name"];
	        this.creator_id = source["creator_id"];
	        this.creator_name = source["creator_name"];
	        this.duration = source["duration"];
	        this.video_id = source["video_id"];
	        this.game_id = source["game_id"];
	        this.language = source["language"];
	        this.title = source["title"];
	        this.view_count = source["view_count"];
	        this.created_at = source["created_at"];
	        this.thumbnail_url = source["thumbnail_url"];
	    }
	}

}

