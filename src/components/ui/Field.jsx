const Field = ({ id, label, icon: Icon, error, right, ...props }) => (
  <div>
    <label htmlFor={id} className="label">{label}</label>
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-ink-3" />}
      <input
        id={id}
        className={`field ${Icon ? "!pl-10" : ""} ${right ? "!pr-11" : ""} ${error ? "!border-red-400 focus:!ring-red-500/15" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {right}
    </div>
    {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
  </div>
);


export default Field;
