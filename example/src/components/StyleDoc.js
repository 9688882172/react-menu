import React from 'react';
import { HashHeading } from './HashHeading';

export const StyleDoc = React.memo(function StyleDoc({
    id,
    title,
    desc,
    rows
}) {

    return (
        <section className="style-doc" aria-labelledby={id}>
            <HashHeading id={id} title={title} heading="h2" />
            {desc}
            {rows &&
                <>
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">CSS selectors</th>
                                <th scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rows.map(({ name, desc }) => (
                                    <tr key={name}>
                                        <td>{name}</td>
                                        <td>{desc}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </>}
        </section>
    );
});
