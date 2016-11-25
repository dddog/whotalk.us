import React, {Component} from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ui from 'actions/ui';
import * as explore from 'actions/explore';
import {Explore} from 'components';
import notify from 'helpers/notify'

class ExploreRoute extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { UIActions, ExploreActions } = this.props;
        UIActions.initialize('explore');
        UIActions.setHeaderTransparency(false);
        UIActions.setFooterVisibility(false);
        ExploreActions.initialize();
    }

    fetchInitialActivities = async () => {
        const { ExploreActions } = this.props;
        await ExploreActions.getInitialActivity();

    }

    handleFollow = async ({activityIndex, userIndex, username}) => {
        const { ExploreActions, status } = this.props;
        ExploreActions.toggleFollowButtonInActivity({activityIndex, userIndex});
        try {
            await ExploreActions.followFromActivity(username);
        } catch(e) {

        }
        ExploreActions.toggleFollowButtonInActivity({activityIndex, userIndex});
    }

    handleUnfollow = async ({activityIndex, userIndex, username}) => {
        const { ExploreActions, status } = this.props;
        ExploreActions.toggleFollowButtonInActivity({activityIndex, userIndex});
        try {
            await ExploreActions.unfollowFromActivity(username);
        } catch(e) {
            
        }
        ExploreActions.toggleFollowButtonInActivity({activityIndex, userIndex});
    }

    componentDidMount () {
        const { status } = this.props;

        // // redirect to login when not logged in
        // if(!status.session.logged) {
        //     this.context.router.transitionTo('/auth');
        //     notify({type: 'error', message: 'Please login before you explore'});
        //     return;
        // }

        this.fetchInitialActivities();

        // fetch initialActivities
    }
    
    
    render() {

        const { status } = this.props;
        const { handleFollow, handleUnfollow } = this;
        
        return (
            <Explore.Container>
                <Explore.LeftBox/>
                <Explore.Feeds 
                    width={ status.clientSize.width - 230  + 'px'} 
                    data={status.activityData}
                    isLast={status.isLast}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                    myUsername={status.session.user.common_profile.username}
                />
            </Explore.Container>
        );
    }
}

ExploreRoute.contextTypes = {
  router: React.PropTypes.object
};


ExploreRoute = connect(
    state => ({
        status: {
            session: state.auth.session,
            clientSize: state.ui.clientSize,
            activityData: state.explore.activityData,
            isLast: state.explore.isLast
        }
    }),
    dispatch => ({
        UIActions: bindActionCreators({
            initialize: ui.initialize,
            setHeaderTransparency: ui.setHeaderTransparency,
            setFooterVisibility: ui.setFooterVisibility
        }, dispatch),
        ExploreActions: bindActionCreators(explore, dispatch)
    })
)(ExploreRoute)
export default ExploreRoute;