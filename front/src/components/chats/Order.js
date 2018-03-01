import React, {Component} from 'react';
import Card, {CardHeader, CardMedia} from 'material-ui/Card';

import ActionDone from 'material-ui-icons/Done'
import ActionNegative from 'material-ui-icons/DoNotDisturbAlt'
import ActionWork from 'material-ui-icons/GroupWork'
import UnreadIcon from 'material-ui-icons/NewReleases'
import SomeoneUnreadIcon from 'material-ui-icons/Mail'
import './../general.css'
import {Link} from 'react-router-dom';


class OrderComponent extends Component {
    stringClosed = this.props.settings.language === "russian"? "Закрыто":"Closed";
    stringAtWork = this.props.settings.language === "russian"? "В работе у ":"At work, current owner: ";
    stringProjectManager = this.props.settings.language === "russian"? "Менеджер проекта: ":"Project Manager: ";


    render() {
        return (
            <Card className="CompanyCard" style={{fontWeight: this.props.emph ? "bolder" : "normal"}}>
                <div className="details" style={{flex: 1}}>
                    <CardMedia className="avatar"
                               image={this.props.img_url}
                    />
                    <div style={{flex: 1}}>
                        <Link to={`/orders/${this.props.id}`}><CardHeader
                                title={ this.props.order_header }
                                avatar={this.props.closed ? (this.props.positive?<ActionDone color="green"/>:<ActionNegative color="red"/>) : <ActionWork/>}
                            /></Link>
                        <div
                            style={{marginLeft: "4em", marginTop: "-1em"}}>{this.props.closed ? this.stringClosed : this.stringAtWork} {this.props.current_user_name}{this.props.closed && this.props.decision !== null ? `, ${this.props.decision}` : ""},  {
                                this.stringProjectManager + this.props.project_manager_name
                        }
                        {
                            this.props.technology?<span style={{fontWeight: "bolder", color: "green"}}> Технология {this.props.technology}</span>:""
                        }</div>
                    </div>
                    <div style={{margin: "auto", padding: "1em" }}>
                            {this.props.closed && this.props.positive && <Link to={`/orders/${this.props.id}/clone`}> {this.props.settings.language === "russian"?"Клонировать":"Clone Order"} </Link>}
                    </div>
                    {this.props.emph && <UnreadIcon color="red" style={{margin: "auto", width: "2em", height: "2em", paddingRight: "1em"}}/>}
                    {this.props.unread && <SomeoneUnreadIcon color="red" style={{margin: "auto", width: "2em", height: "2em", paddingRight: "1em"}}/>}
                </div>
            </Card>
        );
    }
}


export default OrderComponent;