//From step 34 to be inserted into JSX in <TrackList />
{
			    	this.props.tracks.map(track =>  {
			    	return <Track track={track} key={track.id} isRemoval={this.props.isRemoval} />
			    	})
			    }