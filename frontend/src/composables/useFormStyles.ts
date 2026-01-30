export function useFormStyles() {
  return {
    formContainer:
      "p-lg border border-border rounded-lg bg-surface-elevated shadow-md transition-all hover:shadow-lg flex flex-col h-fit sticky top-md",

    formHeader: "text-xl text-primary mb-lg pb-md border-b-2 border-primary/20",

    formGroupContainer: "flex flex-col gap-md",

    // Gap as margin-top only: space after label, minimal after input (error slot stays tight)
    formGroup:
      "flex flex-col [&>*:nth-child(2)]:mt-sm [&>*:nth-child(3)]:mt-0.5",

    label: "font-semibold text-text text-sm tracking-wider",

    optionalLabel: "font-normal text-muted",

    inputWrapper: "relative flex items-center",

    inputIcon:
      "absolute left-md w-5 h-5 text-muted stroke-2 stroke-linecap-round stroke-linejoin-round pointer-events-none transition-colors group-focus-within:text-primary",

    inputBase:
      "w-full py-sm px-md border-2 border-border rounded-md text-base text-text bg-surface font-sans transition-all hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10",

    inputWithIcon:
      "w-full pl-2xl py-sm px-md border-2 border-border rounded-md text-base text-text bg-surface font-sans transition-all hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10",

    inputError:
      "border-danger focus:border-danger focus:ring-danger/20",

    fieldErrorSlot:
      "min-h-4 flex items-center",

    fieldError:
      "text-danger text-xs leading-tight m-0 p-0",

    selectField:
      "w-full py-sm px-md border-2 border-border rounded-md text-base text-text bg-surface font-sans transition-all hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 appearance-none bg-select cursor-pointer pr-2xl",

    buttonBase:
      "py-sm px-lg bg-primary text-white border-none rounded-md cursor-pointer font-semibold transition-all shadow-md uppercase tracking-widest text-sm enabled:hover:bg-primary/90 enabled:hover:shadow-lg enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 focus:outline-none focus:ring-3 focus:ring-primary/30 disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60",

    buttonSecondary:
      "py-sm px-lg bg-muted/20 text-text rounded-md cursor-pointer font-semibold transition-all hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-muted/50",

    buttonDanger:
      "py-sm px-lg bg-danger text-white rounded-md cursor-pointer font-semibold transition-all hover:bg-danger/90 focus:outline-none focus:ring-2 focus:ring-danger/50",

    errorMessage:
      "text-danger text-sm p-md bg-danger/10 border-l-4 border-danger rounded-sm animate-slideIn",

    successMessage:
      "text-success text-sm p-md bg-success/10 border-l-4 border-success rounded-sm animate-slideIn",

    tableContainer:
      "p-lg bg-surface-elevated border border-border rounded-lg shadow-md transition-all flex flex-col gap-lg",

    tableHeader:
      "flex justify-between items-center pb-md border-b-2 border-primary/20 gap-md",

    tableTitle: "text-xl text-primary m-0",

    vendorCount:
      "text-sm text-muted font-medium px-md py-xs bg-surface rounded-md",

    stateContainer:
      "flex flex-col items-center justify-center p-2xl rounded-lg min-h-[200px] gap-md",

    loadingState:
      "flex flex-col items-center justify-center p-2xl rounded-lg min-h-[200px] gap-md bg-primary/5 border-2 border-dashed border-primary/30",

    errorState:
      "flex flex-col items-center justify-center p-2xl rounded-lg min-h-[200px] gap-md bg-danger/5 border-2 border-danger/30 text-danger",

    emptyState:
      "flex flex-col items-center justify-center p-2xl rounded-lg min-h-[200px] gap-md bg-muted/5 border-2 border-dashed border-muted/30 text-muted",

    spinner:
      "w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin",

    stateIcon: "stroke-2 stroke-linecap-round stroke-linejoin-round",

    errorIcon:
      "w-12 h-12 text-danger stroke-2 stroke-linecap-round stroke-linejoin-round",

    emptyIcon:
      "w-16 h-16 opacity-50 stroke-2 stroke-linecap-round stroke-linejoin-round",

    emptyTitle: "text-lg text-text m-0",

    emptyDescription: "text-muted text-sm",

    tableWrapper: "overflow-x-auto rounded-md border border-border",

    table: "w-full border-collapse text-sm",

    tableHeadCell:
      "px-md py-md text-left bg-surface text-text font-semibold uppercase text-xs tracking-wider border-b-2 border-border sticky top-0 z-10",

    tableBodyRow:
      "border-b border-border transition-all bg-bg hover:bg-primary/8 focus:outline-2 focus:outline-offset-[-2px] focus:outline-primary",

    tableBodyRowZebra: "bg-primary/3",

    tableCell: "px-md py-md text-text",

    tableCellName: "px-md py-md font-semibold text-primary",

    tableCellEmail: "px-md py-md text-text-secondary text-xs break-words",

    tableCellType: "px-md py-md",

    badge:
      "inline-block px-sm py-xs rounded-sm font-semibold text-xs uppercase tracking-widest",

    badgeSupplier: "bg-secondary/15 text-secondary",

    badgePartner: "bg-success/15 text-success",
  };
}
