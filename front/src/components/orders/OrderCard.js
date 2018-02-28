import React, {Component} from 'react';
//import {Responsive, WidthProvider} from 'react-grid-layout';
//import _ from 'lodash';

//import Card, {CardActions, CardHeader, CardContent} from 'material-ui/Card';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {FormControlLabel} from 'material-ui/Form';

import Paper from 'material-ui/Paper';
import AutoSuggest from '../input/AutoSuggest'

import './../general.css'
import {Link} from 'react-router-dom';

import * as actionsJactions from '../../actions/jactions';
import * as actionsFiles from '../../actions/files';
import * as actionsFields from '../../actions/fields';

import Loading from "../Loading";
import Saving from "../Saving";
import Typography from 'material-ui/Typography';
import FileUpload from '../input/FileUpload'
import Grid from 'material-ui/Grid';
import Collapse from 'material-ui/transitions/Collapse';

import * as filesApi from '../../api/filesApi';

import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';


const styles = {
    root: {
        padding: "1em",
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        marginTop: "1%",
        width: "95%",
        overflowY: 'auto',
    },
};

class _OrderCardComponent extends Component {
    loading = this.props.settings.language === "russian" ? "Загружается..." : "Loading...";
    region = this.props.settings.language === "russian" ? "Регион" : "Region";
    contact = this.props.settings.language === "russian" ? "Контакт" : "Contact Person";
    contactDetails = this.props.settings.language === "russian" ? "Контактные данные" : "Contact Details";
    address = this.props.settings.language === "russian" ? "Адрес" : "Address";
    officialAddress = this.props.settings.language === "russian" ? "Юридический адрес (для договора)" : "Official Address";
    status = this.props.settings.language === "russian" ? "Статус" : "VIP Status";
    file = this.props.settings.language === "russian" ? "Файл" : "File";
    files = this.props.settings.language === "russian" ? "Файлы" : "Files";
    date = this.props.settings.language === "russian" ? "Дата" : "Date";
    time = this.props.settings.language === "russian" ? "Время" : "Time";
    to = this.props.settings.language === "russian" ? "Кому" : "To";
    deadline = this.props.settings.language === "russian" ? "Срок" : "Deadline";
    description = this.props.settings.language === "russian" ? "Описание" : "Description";
    username = this.props.settings.language === "russian" ? "Пользователь" : "User";
    assignments = this.props.settings.language === "russian" ? "Назначения" : "Assignments";
    history = this.props.settings.language === "russian" ? "История" : "Logs";
    comments = this.props.settings.language === "russian" ? "Комментарий" : "Comment";
    technicalParams = this.props.settings.language === "russian" ? "Технические параметры" : "Technical Details";
    equipment = this.props.settings.language === "russian" ? "Оборудование" : "Equipment";
    orderIsClosed = this.props.settings.language === "russian" ? "Заявка закрыта. " : "The order is closed. ";
    result = this.props.settings.language === "russian" ? "Решение: " : "Order decision: ";
    access_to_non_staff = this.props.settings.language === "russian" ? "Доступ ПО" : "Nonstaff Access";

    constructor(e) {
        super(e);
        this.state = {
            editField: {},
            jactions_expanded: !(localStorage.getItem('jactions_expanded') === "true"),
            comments_expanded: !(localStorage.getItem('comments_expanded') === "true"),
            jactions_movement_expanded: !(localStorage.getItem('jactions_movement_expanded') === "true"),
            files_expanded: !(localStorage.getItem('files_expanded') === "true"),
            fields_expanded: !(localStorage.getItem('fields_expanded') === "true"),
            equipment_expanded: !(localStorage.getItem('equipment_expanded') === "true"),
            company_expanded: !(localStorage.getItem('company_expanded') === "true"),
        }
    }


    expandJactionsMovement() {
        localStorage.setItem('jactions_movement_expanded', this.state.jactions_movement_expanded);
        this.setState({jactions_movement_expanded: !this.state.jactions_movement_expanded});
    }

    expandJactions() {
        localStorage.setItem('jactions_expanded', this.state.jactions_expanded);
        this.setState({jactions_expanded: !this.state.jactions_expanded});
    }

    expandComments() {
        localStorage.setItem('comments_expanded', this.state.comments_expanded);
        this.setState({comments_expanded: !this.state.comments_expanded});
    }

    expandCompany() {
        localStorage.setItem('company_expanded', this.state.company_expanded);
        this.setState({company_expanded: !this.state.company_expanded});
    }

    expandFields() {
        localStorage.setItem('fields_expanded', this.state.fields_expanded);
        this.setState({fields_expanded: !this.state.fields_expanded});
    }

    expandEquipment() {
        localStorage.setItem('equipment_expanded', this.state.equipment_expanded);
        this.setState({equipment_expanded: !this.state.equipment_expanded});
    }

    expandFiles() {
        localStorage.setItem('files_expanded', this.state.files_expanded);
        this.setState({files_expanded: !this.state.files_expanded});
    }

    componentWillMount() {
        //this.props.refreshCurrentCompany(this.props.orderItem.company);
        this.setState({mounted: true});
        console.log("OrderCard Component Will Mount", this.props);
    }

    onBreakpointChange = (breakpoint) => {
        this.setState({
            currentBreakpoint: breakpoint
        });
    };

    renderJactionsCard() {
        return (
            <Paper className='cardInGrid' elevation={10}>
                <Typography onClick={this.expandJactions.bind(this)} className="cardExpandableHeader" align="center"
                            type="headline" component="h3">
                    {this.history}
                </Typography>
                <Collapse style={{overflowY: 'auto', overflowX: 'auto'}} in={this.state.jactions_expanded}
                          transitionDuration="auto" unmountOnExit>
                    <Table className='gridTile'>
                        <TableHead>
                            <TableRow>
                                <TableCell>{this.description}</TableCell>
                                <TableCell>{this.username}</TableCell>
                                <TableCell>{this.time}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.jactions.slice(0).reverse().map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.action}</TableCell>
                                    <TableCell>{row.user_name}</TableCell>
                                    <TableCell>{new Date(row.action_date).toLocaleDateString()}, {new Date(row.action_date).toLocaleTimeString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Collapse>
            </ Paper >
        )
    }

    renderCommentsCard() {
        return (
            <Paper className='cardInGrid' elevation={10}>
                <Typography onClick={this.expandComments.bind(this)} className="cardExpandableHeader" align="center"
                            type="headline" component="h3">
                    Комментарии
                </Typography>
                <Collapse style={{overflowY: 'auto', overflowX: 'auto'}} in={this.state.comments_expanded}
                          transitionDuration="auto" unmountOnExit>
                    <Table className='gridTile'>
                        <TableHead>
                            <TableRow>
                                <TableCell>{this.comments}</TableCell>
                                <TableCell>{this.username}</TableCell>
                                <TableCell>{this.time}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.jactions.slice(0).map((row, index) => (
                                (
                                    row.action.indexOf("Направлено") > -1 ||
                                    row.action.indexOf("описание") > -1 ||
                                    row.action.indexOf("Коммент") > -1
                                )&&
                                <TableRow key={row.id}>
                                    <TableCell>{row.action}<br/>{row.message}</TableCell>
                                    <TableCell>{row.user_name}</TableCell>
                                    <TableCell>{new Date(row.action_date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Collapse>
            </ Paper >
        )
    }

    renderJactionsMovementCard() {
        return (
            <Paper className='cardInGrid' elevation={10}>
                <Typography onClick={this.expandJactionsMovement.bind(this)} className="cardExpandableHeader"
                            type="headline"
                            align="center"
                            component="h3">
                    {this.assignments}
                </Typography>
                <Collapse style={{overflowY: 'auto', overflowX: 'auto'}} in={this.state.jactions_movement_expanded}
                          transitionDuration="auto" unmountOnExit>
                    <Table className='gridTile'>
                        <TableHead>
                            <TableRow>
                                <TableCell>{this.to}</TableCell>
                                <TableCell>{this.comments}</TableCell>
                                <TableCell>{this.date}</TableCell>
                                <TableCell>{this.deadline}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.jactions.filter((item) => (item.user_to_id != null)).map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.user_to_name}</TableCell>
                                    {row.url ?
                                        <TableCell><Link to={row.url}>{row.message}</Link></TableCell> :
                                        <TableCell>{row.message}</TableCell>
                                    }
                                    <TableCell>{new Date(row.action_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{row.deadline === null ? "---" : (new Date(row.deadline).toLocaleDateString()) + "," + (new Date(row.deadline).toLocaleTimeString())}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Collapse>
            </ Paper >
        )
    }

    renderFilesCard() {
        return (
            <Paper className='cardInGrid' elevation={10}>
                <Typography onClick={this.expandFiles.bind(this)} className="cardExpandableHeader" type="headline"
                            align="center"
                            component="h3">
                    {this.files} ({ this.props.files.length })
                </Typography>
                <Collapse style={{overflowY: 'auto', overflowX: 'auto'}} in={this.state.files_expanded}
                          transitionDuration="auto" unmountOnExit>
                    <Table className='gridTile'>
                        <TableHead>
                            <TableRow>
                                <TableCell>{this.file}</TableCell>
                                <TableCell>{this.access_to_non_staff}</TableCell>
                                <TableCell>{this.username}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.files.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell><a href={row.attachment}>{row.file_name}</a></TableCell>
                                    <TableCell><Checkbox id={ `field${row.id}` }
                                           style={{
                                               color: "rgba(0, 0, 0, 0.54)",
                                               fontSize: '0.6em'
                                           }}
                                           checked={row.access_to_non_staff}
                                           onChange={
                                               (event, checked) => {
                                                   console.log(checked);
                                                   this.props.putIntoFile(this.props.order.id, row.id, {access_to_non_staff: checked}).
                                                     then(response => {this.props.refreshFiles(this.props.order.id)})
                                               }
                                           }/></TableCell>
                                    <TableCell>{row.user_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <FileUpload/>
                </Collapse>
            </ Paper>
        )
    }

    renderField(row) {
        if (row.field_type.toLowerCase().substring(0, 4) === "bool")
            return (
                <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                    <FormControlLabel
                        control={<Checkbox id={ `field${row.id}` }
                                           style={{
                                               color: "rgba(0, 0, 0, 0.54)",
                                               fontSize: '0.6em'
                                           }}
                                           disabled={this.props.order.closed}
                                           checked={
                                               this.state.editField[`field${row.id}`] === undefined ?
                                                   row.field_value === "Да" :
                                                   this.state.editField[`field${row.id}`] === "Да"
                                           }
                                           onChange={
                                               (event, checked) => {
                                                   let newVal = (checked ? "Да" : "Нет");
                                                   let newEditField = this.state.editField;
                                                   newEditField[`field${row.id}`] = newVal;
                                                   this.setState({editField: newEditField});
                                                   console.log(this.state.editField)
                                                   this.checkEditForm()
                                               }
                                           }/>}
                        label={row.field_description}
                    />

                </div>
            );
        if (this.props.order.closed)
            return (
                <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                    <label htmlFor={ `field${row.id}`}
                           style={{color: "rgba(0, 0, 0, 0.54)", fontSize: '0.6em'}}>{row.field_description}</label>
                    <TextField id={ `field${row.id}` } defaultValue={row.field_value}
                               value={this.state.editField[`field${row.id}`]}
                               style={{width: "100%", fontSize: "0.6em"}}
                               disabled={true}
                               type={row.field_type.toLowerCase() === "date" && row.field_value !== null ? "date" : "text"}
                               onChange={
                                   (event) => {

                                   }
                               }/>
                </div>
            )
        if (row.general_directory)
            return (
                <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                    <label htmlFor={`field${row.id}`}
                           style={{
                               color: "rgba(0, 0, 0, 0.54)",
                               float: "left",
                               fontSize: "0.6em"
                           }}>{row.field_description}</label>
                    <AutoSuggest id={ `field${row.id}` } value={row.field_value}
                                 options={this.props.gendirs.filter((item) => (item.directory === row.general_directory))}
                                 fontSize="0.6em"
                                 selectionHandler={
                                     (gendir) => {
                                         let newVal = gendir.value;
                                         let newEditField = this.state.editField;
                                         newEditField[`field${row.id}`] = newVal;
                                         this.setState({editField: newEditField})
                                         console.log(this.state.editField)
                                         this.checkEditForm()
                                     }
                                 }
                                 changeHandler={
                                     (gendir) => {
                                         let newVal = gendir.value;
                                         let newEditField = this.state.editField;
                                         newEditField[`field${row.id}`] = newVal;
                                         this.setState({editField: newEditField})
                                         console.log(this.state.editField)
                                         this.checkEditForm()
                                     }
                                 }/>
                </div>
            );
        if (row.field_type.toLowerCase() === "date")
            return (
                <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                    <label htmlFor={ `field${row.id}`}
                           style={{color: "rgba(0, 0, 0, 0.54)", fontSize: '0.6em'}}>{row.field_description}</label>
                    <TextField id={ `field${row.id}` } defaultValue={row.field_value}
                               value={this.state.editField[`field${row.id}`]}
                               style={{width: "100%", fontSize: "0.6em"}}
                               type={"date"} onChange={
                        (event) => {
                            let newVal = event.target.value;
                            let newEditField = this.state.editField;
                            newEditField[`field${row.id}`] = newVal;
                            this.setState({editField: newEditField})
                            console.log(this.state.editField)
                            this.checkEditForm()
                        }
                    }/>
                </div>
            );
        return (
            <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                <label htmlFor={ `field${row.id}`}
                       style={{color: "rgba(0, 0, 0, 0.54)", fontSize: '0.6em'}}>{row.field_description}</label>

                <TextField id={ `field${row.id}` } defaultValue={row.field_value}
                           style={{width: "100%", fontSize: '0.6em'}}
                           type={row.field_type.toLowerCase() === "int" ? "number" : "text"}
                           onChange={
                               (event) => {
                                   let newVal = event.target.value;
                                   let newEditField = this.state.editField;
                                   newEditField[`field${row.id}`] = newVal;
                                   this.setState({editField: newEditField})
                                   console.log(this.state.editField)
                                   this.checkEditForm()
                               }
                           }/>

            </div>
        )
    }

    checkEditForm() {
        let countEquipment = 0;
        let countFields = 0;
        this.props.fields.forEach((field) => {
            let editValue = this.state.editField[`field${field.id}`];
            if (editValue != null) {
                if (editValue.trim() !== field.field_value &&
                    !(editValue.length === 0 && field.field_value == null)
                ) {
                    console.log(field, editValue);
                    if (field.equipment) {
                        countEquipment++;
                    } else {
                        countFields++;
                    }
                }
            }
        });
        this.setState({
            changedFields: (countFields > 0),
            changedEquipment: (countEquipment > 0),
        });
    }

    async submitFields() {
        let toBeSubmitted = [];
        this.props.fields.forEach((field) => {
            let editValue = this.state.editField[`field${field.id}`];
            if (editValue != null) {
                if (editValue.trim() !== field.field_value &&
                    !(editValue.length === 0 && field.field_value == null)
                ) {
                    toBeSubmitted.push({field: field.id, value: editValue})
                }
            }
        });
        if (toBeSubmitted.length > 0) {
            await this.props.submitFields(this.props.order.id, toBeSubmitted);
            await this.props.refreshFields(this.props.order.id);
            this.props.refreshJactions(this.props.order.id);
            this.checkEditForm();
        }
    }

    renderFieldsCard() {
        let color = {}
        if (this.state.changedFields) {
            color = {background: "honeydew"}
        }
        var fields = this.props.fields.filter((item) => {
            return (!item.equipment && !(item.field_type === "file"));
        });

        return (
            <Paper className='cardInGrid'
                   style={{...color, maxHeight: "80em", alignContent: "center", overflowY: 'auto'}} elevation={10}>
                <Typography onClick={this.expandFields.bind(this)} className="cardExpandableHeader"
                            align="center" type="headline"
                            component="h3">
                    {this.technicalParams} ({fields.length})
                </Typography>
                <Collapse in={this.state.fields_expanded} style={{overflowY: 'auto', overflowX: 'auto'}}
                          transitionDuration="auto" unmountOnExit>
                    <div style={{marginBottom: '1em'}}></div>
                    <Grid container spacing={0}>
                        <Grid item sm={12} md={6} className='centerText'>
                            {fields.map((row, index) => (((index + 1) > fields.length / 2) ?
                                    "" :
                                    <div key={row.id}
                                         style={{marginBottom: "0.5em"}}>
                                        <div style={{width: "90%", margin: "auto"}}>
                                            {this.renderField(row)}
                                        </div>
                                    </div>
                            ))}
                        </Grid>
                        <Grid item sm={12} md={6} className='centerText'>
                            {fields.map((row, index) => (((index + 1) <= fields.length / 2) ?
                                    "" :
                                    <div key={row.id}
                                         style={{marginBottom: "0.5em"}}>
                                        <div style={{width: "90%", margin: "auto"}}>
                                            {this.renderField(row)}
                                        </div>
                                    </div>
                            ))}
                        </Grid>
                    </Grid>
                    <div style={{textAlign: "center"}}>
                        <div style={{justifyContent: "center", position: "relative"}}>
                            <Saving
                                handleButtonClick={this.submitFields.bind(this)}
                                success={!this.props.isUpdating && this.props.results.filter((item) => {
                                    return (!item.equipment)
                                }).length && !this.state.changedFields > 0}
                                loading={this.props.isUpdating}
                                changed={this.state.changedFields}
                            />
                        </div>
                    </div>
                </Collapse>
            </ Paper >
        )
    }

    renderEquipmentCard() {
        let color = {}
        if (this.state.changedEquipment) {
            color = {background: "honeydew"}
        }
        var equipment = this.props.fields.filter((item) => {
            return (item.equipment && !(item.field_type === "file"));
        });

        if (equipment.length > 0)
            return (
                <Paper className='cardInGrid'
                       style={{...color, maxHeight: "80em", alignContent: "center", overflowY: 'auto'}} elevation={10}>
                    <Typography onClick={this.expandEquipment.bind(this)} className="cardExpandableHeader"
                                align="center" type="headline"
                                component="h3">
                        {this.equipment} ({ equipment.length })
                    </Typography>
                    <Collapse in={this.state.equipment_expanded} style={{overflowY: 'auto', overflowX: 'auto'}}
                              transitionDuration="auto" unmountOnExit>
                        <div style={{marginBottom: '1em'}}></div>
                        <Grid container spacing={0}>
                            <Grid item sm={12} md={6} className='centerText'>
                                {equipment.map((row, index) => (
                                    (row.field_type === "file") || ((index + 1) > equipment.length / 2) ?
                                        "" :
                                        <div key={row.id}
                                             style={{marginBottom: "0.5em"}}>
                                            <div style={{width: "90%", margin: "auto"}}>
                                                {this.renderField(row)}
                                            </div>
                                        </div>
                                ))}
                            </Grid>
                            <Grid item sm={12} md={6} className='centerText'>
                                {equipment.map((row, index) => (
                                    (row.field_type === "file") || ((index + 1) <= equipment.length / 2) ?
                                        "" :
                                        <div key={row.id}
                                             style={{marginBottom: "0.5em"}}>
                                            <div style={{width: "90%", margin: "auto"}}>
                                                {this.renderField(row)}
                                            </div>
                                        </div>
                                ))}
                            </Grid>
                        </Grid>
                        <div style={{textAlign: "center"}}>
                            <div style={{justifyContent: "center", position: "relative"}}>
                                <Saving
                                    handleButtonClick={this.submitFields.bind(this)}
                                    success={!this.props.isUpdating && this.props.results.filter((item) => {
                                        return (item.equipment)
                                    }).length && !this.state.changedEquipment > 0}
                                    loading={this.props.isUpdating}
                                    changed={this.state.changedEquipment}
                                />
                            </div>
                        </div>
                    </Collapse>
                </Paper>
            )
        return (
            <span></span>
        )
    }


    renderCompanyCard() {
        return (
            <Paper className='cardInGrid' style={{maxHeight: "40em"}} elevation={10} key={this.props.company.id}>
                <Typography onClick={this.expandCompany.bind(this)} className="cardExpandableHeader"
                            align="center" type="headline"
                            component="h3">
                    {this.props.company.company_name}
                </Typography>
                <Collapse in={this.state.company_expanded} style={{overflowY: 'auto'}} transitionDuration="auto"
                          unmountOnExit>
                    <Grid container spacing={8} style={{margin: 0}}>
                        <Grid item md={4} className='centerText' style={{marginTop: "1em"}}>
                            <span style={{height: "100%", verticalAlign: "middle", display: "inline-block"}}></span>
                            <img alt="" src={this.props.company.img_url} className="imgInCard"/>
                        </Grid>
                        <Grid item md={8} style={{fontSize: "0.8em"}}>
                            <div>
                                <p>{this.contact}: {this.props.company.contact_person}</p>
                                <p>{this.contactDetails}: {this.props.company.contact_details}</p>
                                <p>{this.address}: {this.props.company.address}</p>
                                <p>{this.officialAddress}: {this.props.company.formal_address}</p>
                                <p>Email: <a
                                    href="mailto:{row.company_email}">{this.props.company.company_email}</a></p>
                                <p>{this.region}: {this.props.company.region}</p>
                                <p>{this.status}: {this.props.company.status}</p>
                            </div>
                        </Grid>
                    </Grid>
                </Collapse>
            </ Paper>
        )
    }

    render() {
        console.log("OrderCard props", this.props);
        return (
            <div key={this.props.order.id}>
                <div style={styles.root}>
                    {this.props.isLoading ? <Loading/> : ""}
                    {this.props.order.closed ?
                        <div style={{
                            textAlign: "center",
                            fontSize: "1.5em",
                            color: (this.props.order.positive ? "green" : "red")
                        }}>{this.orderIsClosed}{this.props.order.decision !== null && this.props.order.decision.length > 0 ? `, ${this.result} ${this.props.order.decision}` : ""}
                        </div> : <div style={{
                            textAlign: "center",
                            fontSize: "1em",
                            color: "black",
                            marginLeft: "5em"
                        }}>
                            Менеджер проекта: {this.props.order !== undefined && this.props.order.project_manager_name}
                    </div>}
                    <Grid container spacing={24}>
                        <Grid item sm={12} md={6}>
                            { this.props.auth.is_staff && this.renderCompanyCard() }
                            { this.renderFieldsCard() }
                            { this.renderCommentsCard() }
                        </Grid>
                        <Grid item sm={12} md={6}>
                            { this.renderFilesCard() }
                            { this.renderEquipmentCard() }
                            { this.props.auth.is_staff && this.renderJactionsMovementCard() }
                            { this.props.auth.is_staff && this.renderJactionsCard() }
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings.list,
    auth: state.auth.auth,
    company: state.company.details,
    jactions: state.jactions.list,
    files: state.files.list,
    fields: state.fields.list,
    results: state.fields.updateResults,
    gendirs: state.gendirs.list,
    isLoading: state.jactions.isLoading,
    isUpdating: state.fields.isUpdating,
    orderNo: state.jactions.orderNo,
});

const mapDispatchToProps = {
    refreshJactions: actionsJactions.refreshJactions,
    refreshFiles: actionsFiles.refreshFiles,
    putIntoFile: actionsFiles.putIntoFile,
    refreshFields: actionsFields.refreshFields,
    submitFields: actionsFields.submitFields,
};

const OrderCardComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(_OrderCardComponent);

export default OrderCardComponent;