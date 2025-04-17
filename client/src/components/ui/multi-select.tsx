import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";


interface MultiSelectContextType {
  value?: string[];
  onValueChange?: (selected: string[]) => void;
}

const MultiSelectContext = React.createContext<MultiSelectContextType>({});

interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options?: { value: string; label: string }[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  onValueChange?: (selected: string[]) => void;
  placeholder?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ className, options = [], value = [], onChange, onValueChange, placeholder, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);


    const handleChange = (selected: string[]) => {
      if (onChange) onChange(selected);
      if (onValueChange) onValueChange(selected);
    };

    const handleUnselect = (item: string) => {
      handleChange(value.filter((i) => i !== item));
    };

    if (children) {
      return (
        <MultiSelectContext.Provider value={{ value, onValueChange: handleChange }}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                ref={ref}
                className={cn(
                  "flex w-full min-h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )}
                {...props}
              >
                {React.Children.map(children, child => {
                  if (React.isValidElement(child) && child.type === MultiSelectTrigger) {
                    return child;
                  }
                  return null;
                })}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              {React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === MultiSelectContent) {
                  return child;
                }
                return null;
              })}
            </PopoverContent>
          </Popover>
        </MultiSelectContext.Provider>
      );
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            className={cn(
              "flex w-full min-h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          >
            <div className="flex flex-wrap gap-1">
              {value.length > 0 ? (
                value.map((item) => (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {options.find((option) => option.value === item)?.label || item}
                    <button
                      type="button"
                      className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(item);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    handleChange(
                      value.includes(option.value)
                        ? value.filter((v) => v !== option.value)
                        : [...value, option.value]
                    );
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

interface GenericProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
}

export const MultiSelectTrigger = React.forwardRef<HTMLDivElement, GenericProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-1 flex-wrap", className)} {...props}>
      {children}
    </div>
  )
);
MultiSelectTrigger.displayName = "MultiSelectTrigger";

export const MultiSelectValue = React.forwardRef<HTMLDivElement, GenericProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    const context = React.useContext(MultiSelectContext);
    
    return (
      <div ref={ref} className={cn("flex flex-wrap gap-1", className)} {...props}>
        {context.value && context.value.length > 0 ? (
          context.value.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <button
                type="button"
                className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (context.onValueChange) {
                    context.onValueChange(context.value?.filter(v => v !== item) || []);
                  }
                }}
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </Badge>
          ))
        ) : (
          children || (placeholder && <span className="text-muted-foreground">{placeholder}</span>)
        )}
      </div>
    );
  }
);
MultiSelectValue.displayName = "MultiSelectValue";

export const MultiSelectContent = React.forwardRef<HTMLDivElement, GenericProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props}>
      <Command className="w-full">
        <CommandInput placeholder="Search..." />
        <CommandEmpty>No items found.</CommandEmpty>
        <CommandGroup className="max-h-64 overflow-auto">
          {children}
        </CommandGroup>
      </Command>
    </div>
  )
);
MultiSelectContent.displayName = "MultiSelectContent";

interface MultiSelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const MultiSelectItem = React.forwardRef<HTMLDivElement, MultiSelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const context = React.useContext(MultiSelectContext);
    const isSelected = context.value?.includes(value) || false;
    
    return (
      <CommandItem
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(className)}
        {...props}
        onSelect={() => {
          if (context.onValueChange) {
            const newValue = isSelected
              ? context.value?.filter(v => v !== value) || []
              : [...(context.value || []), value];
            context.onValueChange(newValue);
          }
        }}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
        {children}
      </CommandItem>
    );
  }
);
MultiSelectItem.displayName = "MultiSelectItem";

export const MultiSelectProvider: React.FC<{
  children: React.ReactNode;
  value: string[];
  onValueChange: (selected: string[]) => void;
}> = ({ children, value, onValueChange }) => {
  return (
    <MultiSelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </MultiSelectContext.Provider>
  );
};